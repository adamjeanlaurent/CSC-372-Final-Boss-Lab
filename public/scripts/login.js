const form = document.querySelector('form');

form.addEventListener('submit', (e) => { login(e) });

const login = async (e) => {
    e.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const endpoint = '/api/auth/login';
    const options = {
        method: 'post',
        body: {
            username: username,
            password: password,
        }
    }

    const res = await fetch(endpoint, options);
    const json = res.json();
    
    if(json.errors) {
        renderErrors(json.renders);
    }
    else {
        window.location.href = '/profile'; 
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
        div.classList.add('alert', 'alert-warning');
        div.textContent = error;

        // prepend
        document.querySelector('body').appendChild(div);
    }
}
