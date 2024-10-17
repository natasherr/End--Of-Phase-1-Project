document.addEventListener("DOMContentLoaded", () => {
// This is where the generated passwords will be stored
 let passwords =[]
// 1.
// This is the function where the password will be generated.
// The default length of the password will be 15 characters.
 function generatePass(length = 15){
 // Since the password should be random, it should include different letters(both in uppercase and lowercase), symbols and numbers.
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const lowerCase = "abcdefghijklmnopqrstuvwxyz"
  const theSymbols = "!@#$%^&*()_+-:?.;|"
  const theNumbers = "1234567890"

   const combination = upperCase + lowerCase + theSymbols + theNumbers
  //   Here is where the random password will be stored
   let passwad = ""
  //  Here I'll use a for loop where the statement will run if the condition is true.
   for(let a = 0; a < length ; a++){
    // Here there'll be the prompt which combines the characters and makes the random password.
    passwad += combination.charAt(Math.floor(Math.random() * combination.length))
   }
  // Then, I return the generated password
   return passwad
  // When you run "generatePass()" on the website's console more than once, you should be able to see a random password each time.
}

// 2.
// After generating, I want the password to display on the list of generated passwords.
 function showPass(){
    const passwdList = document.getElementById("passwd_list")
    passwdList.innerHTML = ""
    for(let pass of passwords){
        // Here I'm creating a list element that will hold all the passwords generated.
        const theList = document.createElement("li")
        // Inside that list, it should display the name of the user, the password generated and a delete button that enables the user to delete the password.
        // the ' onclick="deletePass(${pass.id})" ' will call a function that enables the user to delete the password.
        theList.innerHTML = `${pass.name} : ${pass.password} <br> <button onclick="deletePass(${pass.id})" class = "btn btn-danger btn-sm">Delete</button>`
        passwdList.appendChild(theList)
    }
 }

// 3.
// The function that enables the user to delete the password once the delete button is clicked.
 function deletePass(id){
    // We are going to fetch a specific id that's going to be deleted.
    fetch(`https://end-of-phase-1-project.onrender.com/${id}` , {
      method: "DELETE"},)
     .then ((res) => res.json())
     .then (() => {
        passwords = passwords.filter(pass => pass.id !== id)
        showPass()
        alert("Deleted!") })
     .catch((error) => alert("Failed to delete!"))
 }

// 4.
// Then, I want to save the generated password to the database, which is db.json
 function savePass(password){
//  First, I write the second argument that will be in the fetch.
  const configObj = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept" : "application/json"
    },
    // the JSON.stringify converts the objects to strings
    body: JSON.stringify(password)
    }
// The fetch operation.The URL being called is redirecting to db.json
  fetch("https://end-of-phase-1-project.onrender.com/passwords", configObj)
   .then ((res) => res.json())
   .then ((object) => {
     passwords.push(object)
     showPass()})
//    I'm adding catch to debug and see is there's an error.
   .catch((error) => alert("There is an error somewhere!"))
 }

// 5.
// Fetching and displaying all the passwords.
 function dispayAll () {
    fetch("https://end-of-phase-1-project.onrender.com/passwords")
     .then((res) => res.json())
     .then((data) => {
        passwords = data
        showPass()
     })
 }

// Dealing with the functionality of the buttons.

// Generate Button
 const generate = document.getElementById("gen_button")
 generate.addEventListener("click", () => {
    const theName = document.getElementById("user_name").value.trim()
    const newPass = generatePass()
    const generating = document.getElementById("generating")
    generating.innerText = newPass

    if(theName){
        const newPassObject = {
            id: Date.now(), 
            name: theName, 
            password : newPass}
        // Adding the data to the array(which is in line 1) after pressing generate.
        passwords.push(newPassObject)
        // Saving the password to the database.
        savePass(newPassObject)}

     else{alert("Insert your name!")}
 })

// Copy Button
// The Copy button was unsuccesfull and was not actually copying to the clipboard.
//  const copy = document.getElementById("copy")
//  copy.addEventListener("click", () => {
//     const password = document.getElementById("generating").innerText
//     navigator.clipboard.writeText(password).then(() => {
//         alert("Copied!")
//     })
//  })

// Regenerate Button
  const regen_button = document.getElementById("regen_button")
  regen_button.addEventListener("click", () => {
     const regenPass = generatePass()
// Here the password that was initially generated is overwritten.
    document.getElementById("generating").innerText = regenPass
  })

  if(passwords.length > 0) {
     const lastPass = passwords[passwords.length - 1]
     if(lastPass){
        fetch(`https://end-of-phase-1-project.onrender.com/${lastPass.id}`,{
            method : "PATCH",
            headers : {"Content-Type" : "application/json"},
            body: JSON.stringify({password: regenPass})
         })
         .then ((res) => res.json())
         .then(() => {
            lastPass.password = regenPass
            showPass()})
       }
      else{alert("Insert your name!")}
  }
  dispayAll()

})



