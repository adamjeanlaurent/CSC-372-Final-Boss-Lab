const form = document.querySelector('form');
form.addEventListener('submit', (e) => { register(e) });

const register = async (e) => {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const endpoint = '/api/auth/register';
    const options = {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            name: name,
            username: username,
            password: password,
        })
    }

    const res = await fetch(endpoint, options);
    const json = await res.json();
    
    if(json.errors) {
        renderErrors(json.errors);
    }
    else {
        window.location.href = '/login'; 
    }
}

const renderErrors = (errors) => {
    // delete alerts
    const alerts = document.querySelectorAll('.alert');

    for(let alert of alerts) {
        alert.remove();
    }

    for(let error of errors) {
         // create div
        const div = document.createElement('div');
        div.classList.add('alert', 'alert-danger');
        div.textContent = error;

        // prepend
        document.querySelector('#errors').prepend(div);
    }
}