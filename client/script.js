var json
fetch('data.json').then(response => {
    return response.json()
}).then(data => {
    console.log(data)
    document.getElementById('name').innerHTML = 'Name: ' + data['name']
})

