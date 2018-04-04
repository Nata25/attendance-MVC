
let model = {
    students: [
        {
            name: 'Slappy the Frog',
            days: [],
            totalMissed: 0,
        },
        {
            name: 'Lilly the Lizard',
            days: [],
            totalMissed: 0,
        },
        {
            name: 'Paulrus the Walrus',
            days: [],
            totalMissed: 0,
        },
        {
            name: 'Gregory the Goat',
            days: [],
            totalMissed: 0,
        },
        {
            name: 'Adam the Anaconda',
            days: [],
            totalMissed: 0,
        },
    ],

    numOfDays: 12,
}

let view = {

    init: function() {
        const students = octopus.getStudents();
        const days = octopus.getNumOfDays();

        for (let i = 0; i < days; i++) {
            $('th.missed-col').before("<th>" + (i+1) + "</th>");
        }

        // Generate table of student attendance 
        for (let s = 0; s < students.length; s++) {
            const studentBlock = $('tbody').append('<tr class="student"></tr>');
            const studentRow = $('<tr class="student"></tr>');
            const student = students[s];
            studentRow.append('<td class="name-col">' + student.name + '</td>');
            for (let i = 0; i < days; i++) {
                const attendCol = $('<td class="attend-col"></td>');
                const input = $('<input type="checkbox">');
                input.prop('checked', student.days[i]);
                
                // event listener on checkbox
                input.on('click', function() {
                    octopus.updateAttendance(student.name, i);
                    octopus.updateTotalMissed(student.name);
                    const missed = studentRow.children('.missed-col');
                    missed.html(octopus.updateTotalMissed(student.name));
                });
                studentRow.append(attendCol.append(input));
            }
            studentRow.append('<td class="missed-col">' + octopus.getTotalMissed(student.name) + '</td>');
            studentBlock.append(studentRow);
        }
    },
}

let octopus = {
    getStudents: function() {
        return model.students;
    },

    getNumOfDays: function() {
        return model.numOfDays;
    },

    populateDays: function() {
        const attendance = JSON.parse(localStorage.attendance);
        $.each(model.students, function(ind, student) {
            student.days = attendance[student.name];
            student.totalMissed = octopus.updateTotalMissed(student.name);
        });
    },

    updateTotalMissed: function(name) {
        const totalAttendance = model.students.find(student => student.name === name).days;
        return totalAttendance.filter(day => !day).length;
    },

    getTotalMissed: function(name) {
        return model.students.find(student => student.name === name).totalMissed;
    },

    updateAttendance: function(name, day) {
        const student = model.students.find(student => student.name === name);
        student.days[day] = !student.days[day];
        // Update local storage
        let attendance = JSON.parse(localStorage.getItem('attendance'));
        attendance[name][day] = student.days[day];
        localStorage.setItem('attendance', JSON.stringify(attendance));
    },

    initStorage: function() {
                console.log('Creating attendance records...');
                function getRandom() {
                    return (Math.random() >= 0.5);
                }
        
                const nameColumns = model.students;
                let attendance = {};
        
                nameColumns.forEach(function(student) {
                    const name = student.name;
                    attendance[name] = [];
        
                    for (let i = 0; i <= 11; i++) {
                        attendance[name].push(getRandom());
                    }
                });
        
                localStorage.attendance = JSON.stringify(attendance);
                console.log(attendance);
    },

    init: function() {
        if (!localStorage.getItem('attendance')) {
            octopus.initStorage();
        }
        octopus.populateDays();
        view.init();
    },
}

octopus.init();