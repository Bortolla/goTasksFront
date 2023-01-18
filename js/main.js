function submitLoginForm() 
{
    let usernameSuccess = 1;
    let passwordSuccess = 1;

    const loginUsernameElement = document.getElementById('loginUsername');
    const loginPasswordElement = document.getElementById('loginPassword');

    const loginUsernameSpanElement = document.getElementById('loginUsernameSpan');
    const loginPasswordSpanElement = document.getElementById('loginPasswordSpan');

    if (loginUsernameElement.value.length < 8)
    {
        document.getElementById('wrongLoginInfoSpan').innerText = '';
        loginUsernameSpanElement.innerText = 'Username must be at least 8 characters long';
        usernameSuccess = 0;
    }
    else
    {
        loginUsernameSpanElement.innerText = '';
        usernameSuccess = 1;
    }

    if (loginPasswordElement.value.length < 8)
    {
        document.getElementById('wrongLoginInfoSpan').innerText = '';
        loginPasswordSpanElement.innerText = 'Password must be at least 8 characters long';
        passwordSuccess = 0;
    }
    else
    {
        loginPasswordSpanElement.innerText = '';
        passwordSuccess = 1;
    }

    if (usernameSuccess && passwordSuccess)
    {
        apiCallToCheckLoginInfo(loginUsernameElement.value, loginPasswordElement.value);
    }
}

function apiCallToCheckLoginInfo(username, password)
{
    const urlToCheckLoginInfo = '../../backEnd/checkLogin.php';

    const data = {"username":username, "password":password};
    jsonData = JSON.stringify(data);

    fetch(urlToCheckLoginInfo, {method:'POST', body: jsonData})
    .then(response => response.json())
    .then(jsonObject => 
    {
        if (jsonObject['status'] == 500)
        {
            window.location.href = 'http://localhost/trabalhoLinguagens/frontEnd/html/somethingWentWrong.html';;
        }
        else if (jsonObject['status'] == 401)
        {
            document.getElementById('wrongLoginInfoSpan').innerText = 'Wrong username or password';
        }
        else if (jsonObject['status'] == 200)
        {
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            window.location.href = 'http://localhost/trabalhoLinguagens/frontEnd/html/main.html';
        }
    })
    .catch(error => {
        window.location.href = 'http://localhost/trabalhoLinguagens/frontEnd/html/somethingWentWrong.html';;
    })
    
}

function submitSignUpForm()
{
    const signUpUsernameElement = document.getElementById('signUpUsername');
    const signUpPasswordElement = document.getElementById('signUpPassword');
    const confirmPasswordElement = document.getElementById('confirmPassword');

    const signUpUsernameSpanElement = document.getElementById('signUpUsernameSpan');
    const signUpPasswordSpanElement = document.getElementById('signUpPasswordSpan');
    const confirmPasswordSpanElement = document.getElementById('confirmPasswordSpan');

    if (signUpUsernameElement.value.length < 8)
    {
        signUpUsernameSpanElement.innerText = 'Username must be at least 8 characters long';
        usernameSuccess = 0;
    }
    else
    {
        signUpUsernameSpanElement.innerText = '';
        usernameSuccess = 1;
    }

    if (signUpPasswordElement.value.length < 8)
    {
        signUpPasswordSpanElement.innerText = 'Password must be at least 8 characters long';
        passwordSuccess = 0;
    }
    else
    {
        signUpPasswordSpanElement.innerText = '';
        passwordSuccess = 1;
    }

    if (confirmPasswordElement.value !== signUpPasswordElement.value)
    {
        confirmPasswordSpanElement.innerText = 'Passwords dont match';
        confirmPasswordSuccess = 0;
    }
    else
    {
        confirmPasswordSpanElement.innerText = '';
        confirmPasswordSuccess = 1;
    }

    if (usernameSuccess && passwordSuccess && confirmPasswordSuccess)
    {
        createUser(signUpUsernameElement.value, signUpPasswordElement.value);
    }
}

function createUser(username, password)
{
    const urlToCheckLoginInfo = '../../backEnd/cadastrar.php';

    const data = {"username":username, "password":password};
    jsonData = JSON.stringify(data);

    fetch(urlToCheckLoginInfo, {method:'POST', body: jsonData})
    .then(response => response.json())
    .then(jsonObject => 
    {
        if (jsonObject['status'] == 500)
        {
            window.location.href = 'http://localhost/trabalhoLinguagens/frontEnd/html/somethingWentWrong.html';;
        }
        else if (jsonObject['status'] == 409)
        {
            document.getElementById('signUpUsernameSpan').innerText = 'Username already in use';
        }
        else if (jsonObject['status'] == 201)
        {
            document.getElementById('signUpUsername').value = '';
            document.getElementById('signUpPassword').value = '';
            document.getElementById('confirmPassword').value = '';
            document.getElementById('confirmPasswordSpan').innerText = 'Account created';
        }
    })
    .catch(error => {
        window.location.href = 'http://localhost/trabalhoLinguagens/frontEnd/html/somethingWentWrong.html';;
    })
}

function checkAuthStatus(currentPage)
{
    username = localStorage.getItem('username');
    password = localStorage.getItem('password');

    if (!username || !password)
    {
        if (currentPage == 'main.html')
        {
            window.location.href = 'http://localhost/trabalhoLinguagens/frontEnd/html/login.html';
        }
    }
    else
    {
        const urlToCheckLoginInfo = '../../backEnd/checkLogin.php';

        const data = {"username":username, "password":password};
        jsonData = JSON.stringify(data);

        fetch(urlToCheckLoginInfo, {method:'POST', body: jsonData})
        .then(response => response.json())
        .then(jsonObject => 
        {
            if (jsonObject['status'] == 500)
            {
                window.location.href = 'http://localhost/trabalhoLinguagens/frontEnd/html/somethingWentWrong.html';;
            }
            else if (jsonObject['status'] == 401)
            {
                localStorage.removeItem('username');
                localStorage.removeItem('password');
                if (currentPage == 'main.html')
                {
                    window.location.href = 'http://localhost/trabalhoLinguagens/frontEnd/html/login.html';
                }
            }
            else if (jsonObject['status'] == 200)
            {
                if (currentPage != 'main.html')
                {
                    window.location.href = 'http://localhost/trabalhoLinguagens/frontEnd/html/main.html';
                }
                document.getElementById('welcome').innerText = 'Hello ' + localStorage.getItem('username') + ' :)';
            }
        })
        .catch(error => 
        {
            window.location.href = 'http://localhost/trabalhoLinguagens/frontEnd/html/somethingWentWrong.html';;
        })
    }
}

function createTask()
{
    
}

function logOut()
{
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    window.location.href = 'http://localhost/trabalhoLinguagens/frontEnd/html/login.html';
}