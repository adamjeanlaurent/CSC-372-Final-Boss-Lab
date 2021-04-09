const showName = async () => {
    const endpoint = '/api/profile/getName';
    const res = await fetch(endpoint);
    const json = await res.json();

    if(!json.errors) {
        document.querySelector('h1').textContent = `Weclome ${json.name}`
    }
}

const logout = async (e) => {
    console.log('clicked!!!');
    const endpoint = '/api/auth/logout';
    const options = {
        method: 'post'
    }

    const res = await fetch(endpoint, options);
    const json = await res.json();
    
    if(json.message) {
        window.location.href = '/login'; 
    }
}

const button = document.querySelector('.btn-primary');

button.addEventListener('click', (e) => { logout(e) });

// show name
showName();
