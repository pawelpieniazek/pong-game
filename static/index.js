const socket = io();

socket.on('connect', function(){
    socket.emit('get ranking')
})

socket.on('ranking', (data) => {
    $('#ranking').text('')
    for (let i=0; i<data.length; i++){
        
        let tr = document.createElement('tr')
        let user = data[i]['username']
        let td = document.createElement('td')
        td.append(user)

        let points = data[i]['points']
        let td2 = document.createElement('td')
        td2.append(points)

        tr.append(td,td2)
        $('#ranking').append(tr)
    }
})

// MULTI

    // right
$('#multi').on('click', function(){
    $('#singlediv').hide()
    $('#multidiv').show()
    $('#playmulti').show()
})
$('#usernameright').on('keyup', function(key) {
    if($(this).val().length > 0){
        $('#submitusernameright').attr('disabled', false)
        if(key.keyCode == 13){
            $('#submitusernameright').click()
        }
    }
    else{
        $('#submitusernameright').attr('disabled', true)
    }
});
$('#submitusernameright').on('click', function(){
    localStorage.setItem('usernameright', $('#usernameright').val())
    $('#usernameright').val("")
})
    // left
$('#usernameleft').on('keyup', function(key) {
    if($(this).val().length > 0){
        $('#submitusernameleft').attr('disabled', false)
        if(key.keyCode == 13){
            $('#submitusernameleft').click()
        }
    }
    else{
        $('#submitusernameleft').attr('disabled', true)
    }
});
$('#submitusernameleft').on('click', function(){
    localStorage.setItem('usernameleft', $('#usernameleft').val())
    $('#usernameleft').val("")
    
})

// SINGLE

$('#username').on('keyup', function(key) {
    if($(this).val().length > 0){
        $('#submitusername').attr('disabled', false)
        if(key.keyCode == 13){
            $('#submitusername').click()
        }
    }
    else{
        $('#submitusername').attr('disabled', true)
    }
});
$('#submitusername').on('click', function(){
    localStorage.setItem('username', $('#username').val());
    socket.emit('username', {'username': $('#username').val()});
    socket.emit('get ranking')
    $('#username').val("")
})

// ***********************
let level;

$('#easy').on('click', function(){
    $('#'+level).hide()
    level = 'playeasy'
    show()
})
$('#medium').on('click', function(){
    $('#'+level).hide()
    level = 'playmedium'
    show()
})
$('#hard').on('click', function(){
    $('#'+level).hide()
    level = 'playhard'
    show()
})

let show = () => {
    $('#multidiv').hide()
    $('#playmulti').hide()
    $('#singlediv').show()
    $('#'+level).show()
    if(!localStorage.username){
        $('#name').show()
    }
}
