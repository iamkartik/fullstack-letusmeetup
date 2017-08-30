// js for create page
function createPage() {
    const formInputs = document.querySelectorAll('.rowContainer>input,button');
    const date = document.querySelector('#date');
    const time = document.querySelector('#time');
    const create = document.querySelector('#create');
    const eventLink = document.querySelector('.eventLink');

    const inputs = [...formInputs];

    flatpickr(date, {minDate: "today"});

    flatpickr(time, {
        enableTime: true,
        noCalendar: true,
        time_24hr: true,
        dateFormat: "H:i",
        defaultHour: 12,
        defaultMinute: 0
    });

    function showChecked() {

        if (this.value.length > 0) {
            this.classList.add('filled');
            const index = inputs.indexOf(this);
            inputs[index + 1].style.opacity = 1;
            if (this.name === 'venue') {
                inputs[index + 2].style.opacity = 1;
            }
        } else {
            this.classList.remove('filled');
        }
    }

    function createEvent(e) {
        e.preventDefault();
        const data = inputs.map(input => input.value);
        // .local().format() is used to change the date in 
        // yyyy-mm-ddTHH:mm:ss+timezone
        // while displaying the timezone can be extracted and proper time can be displayed
        const date = moment(data[2]).local().format();
        const hours = data[3].split(':')[0];
        const minutes = data[3].split(':')[1];
        // only time parsing can cause an issue , put it in the final date and send it 
        const time = moment(date).add(hours, 'hours').add(minutes, 'minutes').local().format();

        const eventdata = {
            eventName: data[0],
            organizer: data[1],
            location: data[4],
            email: data[5],
            date: date,
            time: time
        };
        console.log(JSON.stringify(eventdata));
        const url = `${window.location.origin}/create`;
        fetch(url, {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventdata)
        }).then(res => {

            if (res.status == 200) {
                res.text()
                    .then(txt => {
                        eventLink.querySelector('#link').innerHTML = txt;
                        eventLink.style.opacity = 1;
                    });
            } else {
                console.error(res);
            }

        }).catch(err => {
            console.error(err);
        });

    }

    inputs.forEach(input => input.addEventListener('input', showChecked));
    create.addEventListener('click', createEvent);
}

// Js for event page
function eventPage(){
    const attend = document.querySelector('#attend');
    const decline = document.querySelector('#decline');
    const thanks = document.querySelector('#thanks');
    const nothanks= document.querySelector('#nothanks');
    const submitEmail= document.querySelector('#submitEmail');
    const form = document.querySelector('.confirmForm');
    const show = document.querySelector('.show');
    const attendees = document.querySelector('.attendees');

    function hideButtons(){
        attend.style.display='none';
        decline.style.display='none';
    }
    function declineText(){
        hideButtons();
        nothanks.style.display='block';
    }
    function confirmForm(){
        hideButtons();
        form.style.display='block';
    }

    function addName(e){
        e.preventDefault();
        attendees.style.display='none';
        const name = document.querySelector('#name');
        const email = document.querySelector('#email');
        // get eventId from url
        const eventId = window.location.pathname.split('/')[2];
        const attendee={
            eventId:eventId,
            name:name.value
        }
        if(email.value){
            attendee['email']=email.value;
        }
        const url = `${window.location.origin}/confirm`;
        fetch(url, {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(attendee)
        }).then(res => {
            if (res.status == 200) {
                form.style.display='none';
                thanks.style.display='block';
                }
            else {
                console.error(res);
            }

        }).catch(err => {
            console.error(err);
        });

    }

    function attendeeText(){
        const attendeeArray = attendees.innerText.split(',');
        
        let attendeeText = attendees.innerText;
        if(attendees.innerText===''){
            attendeeText+='Oops looks like you are the first one !';
        }else if(attendeeArray.length===1){ 
            attendeeText+=' is attending.';
        }else{
            attendeeText+=' are attending.';
        }
        attendees.innerText = attendeeText;
        this.parentNode.style.display='none';
        attendees.style.display='block';
    }

    attend.addEventListener('click',confirmForm);
    decline.addEventListener('click',declineText);
    // add submit event listner to form rather than button
    // submit event allows the form validations to take place before submit 
    // ie email and required fields 
    form.addEventListener('submit',addName,false);
    show.addEventListener('click',attendeeText);

}




