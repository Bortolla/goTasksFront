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
    const urlToCheckLoginInfo = 'http://localhost:3333/login';

    const data = {"nome":username, "senha":password};
    jsonData = JSON.stringify(data);

    fetch(urlToCheckLoginInfo, {method:'POST', body: jsonData})
    .then(response => response.json())
    .then(jsonObject => 
    {
        if (jsonObject['status'] == 500)
        {
            window.location.href = '../html/somethingWentWrong.html';
        }
        else if (jsonObject['status'] == 401)
        {
            document.getElementById('wrongLoginInfoSpan').innerText = 'Wrong username or password';
        }
        else if (jsonObject['status'] == 200)
        {
            localStorage.setItem('nome', username);
            localStorage.setItem('senha', password);
            localStorage.setItem('id', jsonObject['usuarioId']);
            window.location.href = '../html/main.html';
        }
    })
    .catch(error => {
        window.location.href = '../html/somethingWentWrong.html';
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
    const urlToCheckLoginInfo = 'http://localhost:3333/register';

    const data = {"nome":username, "senha":password};
    jsonData = JSON.stringify(data);

    fetch(urlToCheckLoginInfo, {method:'POST', body: jsonData})
    .then(response => response.json())
    .then(jsonObject => 
    {
        if (jsonObject['status'] == 500)
        {
            window.location.href = '../html/somethingWentWrong.html';
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
        window.location.href = '../html/somethingWentWrong.html';
    })
}

function checkAuthStatus(currentPage)
{
    username = localStorage.getItem('nome');
    password = localStorage.getItem('senha');

    if (!username || !password)
    {
        if (currentPage == 'main.html')
        {
            window.location.href = '../html/login.html';
        }
    }
    else
    {
        const urlToCheckLoginInfo = 'http://localhost:3333/login';

        const data = {"nome":username, "senha":password};
        jsonData = JSON.stringify(data);

        fetch(urlToCheckLoginInfo, {method:'POST', body: jsonData})
        .then(response => response.json())
        .then(jsonObject => 
        {
            if (jsonObject['status'] == 500)
            {
                window.location.href = '../html/somethingWentWrong.html';
            }
            else if (jsonObject['status'] == 401)
            {
                localStorage.removeItem('nome');
                localStorage.removeItem('senha');
                if (currentPage == 'main.html')
                {
                    window.location.href = '../html/login.html';
                }
            }
            else if (jsonObject['status'] == 200)
            {
                if (currentPage != 'main.html')
                {
                    window.location.href = '../html/main.html';
                }
                document.getElementById('welcome').innerText = 'Hello ' + localStorage.getItem('nome') + ' :)';
                getTasks();
            }
        })
        .catch(error => 
        {

        })
    }
}

function createTask()
{
    const task = document.getElementById('taskInput').value;
    userId = parseInt(localStorage.getItem('id'));

    if (task.length < 1)
    {
        document.getElementById('taskSpan').innerText = 'Please inform a task to create';
    }
    else
    {
        const urlToCreateTask = 'http://localhost:3333/createTask';

        const data = {"usuarioId":userId, "nomeTarefa":task};
        jsonData = JSON.stringify(data);

        fetch(urlToCreateTask, {method:'POST', body: jsonData})
        .then(response => response.json())
        .then(jsonObject => 
        {
            if (jsonObject['status'] == 500)
            {
                window.location.href = '../html/somethingWentWrong.html';
            }
            else if (jsonObject['status'] == 200)
            {
                document.getElementById('taskInput').value = '';
                document.getElementById('taskSpan').innerText = 'Task created';
                document.getElementById('tasksDiv').innerHTML = '';
                getTasks();
            }
        })
        .catch(error => 
        {
            window.location.href = '../html/somethingWentWrong.html';
        })
    }
}

function getTasks()
{
    userId = parseInt(localStorage.getItem('id'));

    const urlToGetTasks = 'http://localhost:3333/getTasks';

    const data = {"usuarioId":userId};
    jsonData = JSON.stringify(data);

    fetch(urlToGetTasks, {method:'POST', body: jsonData})
    .then(response => response.json())
    .then(jsonObject => 
    {
        if (jsonObject['status'] == 404)
        {
            localStorage.removeItem('nome');
            localStorage.removeItem('senha');
            localStorage.removeItem('id');
            window.location.href = '../html/login.html';
        }
        else if (jsonObject['status'] == 200)
        {
            const tasksDiv = document.getElementById('tasksDiv');

            for (task in jsonObject['tasks']) {
                taskNum = parseInt(task) + 1;
                tasksDiv.innerHTML = tasksDiv.innerHTML + 'Task ' + taskNum + ':';
                tasksDiv.innerHTML = tasksDiv.innerHTML + '<p id="task' + taskNum + '">' + jsonObject['tasks'][task] + '</p>' + '<button onclick="deleteTask(' + taskNum + ')">Delete</button>' + '<br>';
              }
        }
    })
    .catch(error => 
    {
        window.location.href = '../html/somethingWentWrong.html';
    })
    
}

function deleteTask(taskNumber)
{
    const taskId = String('task' + taskNumber);

    const taskToDelete = document.getElementById(taskId).innerText;
    console.log(taskToDelete);

    userId = parseInt(localStorage.getItem('id'));

    const urlToDeleteTasks = 'http://localhost:3333/deleteTask';

    const data = {"usuarioId":userId, "nomeDaTarefa":taskToDelete};
    jsonData = JSON.stringify(data);

    fetch(urlToDeleteTasks, {method:'POST', body: jsonData})
    .then(response => response.json())
    .then(jsonObject => 
    {
        if (jsonObject['status'] == 500)
        {

        }
        else if (jsonObject['status'] == 404)
        {
            window.location.href = '../html/main.html';
        }
        else if (jsonObject['status'] == 200)
        {
            document.getElementById('tasksDiv').innerHTML = '';
            getTasks();
        }
    })
    .catch(error => 
    {

    })
}

function logOut()
{
    localStorage.removeItem('nome');
    localStorage.removeItem('senha');
    window.location.href = '../html/login.html';
}