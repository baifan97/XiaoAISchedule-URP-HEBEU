function scheduleHtmlParser(html) {
    var result = []
    var table = $("*").find("tr")
    var code = ["一", "二", "三", "四", "五", "六", "日"]
    for (let i = 1; i < table.length; i++) {
        //跳过第一行的标题
        let course = {
            sections: [],
            weeks: []
        }
        let tr = $(table[i]).children()
        if (tr.length == 2) {
            //同一课程多节课,一行只有最后两列有值
            course.name = result[result.length - 1].name
            course.teacher = result[result.length - 1].teacher.replace(/\*/g, "").trim()
            course.position = $(tr[1]).text().replace(/>>/g, "").replace(/新校区/g, "").replace(/15号楼机电/g, "15机电").replace(/16号楼信电/g, "16信电").replace(/26号楼水电/g, "26水电").replace(/4号楼科研楼/g, "④科研楼").replace(/丛台校区/g, "丛台").replace(/四教学楼(医)/g, "四教医")
            var time = $(tr[0]).text()
        } else {
            course.name = $(tr[1]).text()
            course.teacher = $(tr[9]).text().replace(/\*/g, "").trim()
            course.position = $(tr[tr.length - 1]).text().replace(/>>/g, "").replace(/新校区/g, "").replace(/15号楼机电/g, "15机电").replace(/16号楼信电/g, "16信电").replace(/26号楼水电/g, "26水电").replace(/4号楼科研楼/g, "④科研楼").replace(/丛台校区/g, "丛台").replace(/四教学楼(医)/g, "四教医")
            var time = $(tr[tr.length - 2]).text()
            if (time == "")
                //没有时间的课
                continue;
        }

        course.weeks.length = 0
        let temp = time.split(">>")
        //0 周数,1 星期,2 节数
        let w = temp[0].split('周')
        let ws = w[0].split(',')
        
        if (ws.length > 1) {
            //周数不连续，中间有逗号 eg "3-5，7-9周"
            for (let j = 0; j < ws.length; j++) {
                let wNumber = ws[j].split('-')
                for (let j = parseInt(wNumber[0]); j <= parseInt(wNumber[1]); j++)
                    course.weeks.push(j)
            }

        } else {
            //周数连续，中间无逗号
            let wNumber = temp[0].split('-')
            if (wNumber.length == 1) {
                //只上一周 eg "第5周"
                course.weeks.push(parseInt(wNumber[0].charAt(1)))
            } else {
                //eg "3-9周单"
                if (w[1].charAt(0) == '单') {
                    for (let j = parseInt(wNumber[0]); j <= parseInt(wNumber[1]); j++)
                        if (j % 2 == 1) 
                            course.weeks.push(j)
                } else if (w[1].charAt(0) == '双') {
                    for (let j = parseInt(wNumber[0]); j <= parseInt(wNumber[1]); j++)
                        if (j % 2 == 0)
                            course.weeks.push(j)
                } else {
                    //eg"3-5周上"
                    for (let j = parseInt(wNumber[0]); j <= parseInt(wNumber[1]); j++)
                        course.weeks.push(j)
                }
            }
        }
        
        //星期几
        let d = temp[1].charAt(2)
        for (let j = 0; j < 7; j++) {
            if (code[j] == d) {
                course.day = j + 1;
                break;
            }
        }

        //第几节
        course.sections.length = 0
        let s = temp[2].split('-')
        for (let j = parseInt(s[0]); j <= parseInt(s[1]); j++) {
            course.sections.push({
                section: j
            })
        }
        result.push(course)
    }
    //设置课程表时间
    let sectionTime = [{
            "section": 1,
            "startTime": "08:30",
            "endTime": "09:15"
        },
        {
            "section": 2,
            "startTime": "09:20",
            "endTime": "10:05"
        },
        {
            "section": 3,
            "startTime": "10:25",
            "endTime": "11:00"
        },
        {
            "section": 4,
            "startTime": "11:15",
            "endTime": "12:00"
        },
        {
            "section": 5,
            "startTime": "13:30",
            "endTime": "14:15"
        },
        {
            "section": 6,
            "startTime": "14:20",
            "endTime": "15:05"
        },
        {
            "section": 7,
            "startTime": "15:25",
            "endTime": "16:10"
        },
        {
            "section": 8,
            "startTime": "16:15",
            "endTime": "17:00"
        },
        {
            "section": 9,
            "startTime": "19:00",
            "endTime": "19:45"
        },
        {
            "section": 10,
            "startTime": "19:50",
            "endTime": "20:35"
        }
    ]

    

    return {
        courseInfos: result, sectionTimes: sectionTime
    }
}
