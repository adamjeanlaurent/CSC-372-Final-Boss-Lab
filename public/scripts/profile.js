const button = document.querySelector('button');

button.addEventListener('onclick', (e) => { logout(e) });

// show name
showName();

const showName = async () => {
    const endpoint = '/api/auth/profile';
    const res = await fetch(endpoint);
    const json = res.json();

    if(!json.errors) {
        document.querySelector('h1').textContent = `Weclome ${json.name}`
    }
}

const logout = async (e) => {
    const endpoint = '/api/auth/logout';
    const options = {
        method: 'post'
    }

    const res = await fetch(endpoint, options);
    const json = res.json();
    
    if(json.message) {
        window.location.href = '/login'; 
    }
}

