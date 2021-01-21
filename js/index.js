let user = {} 

//Stable Elements
const listPanel = document.getElementById("list-panel")
const bookList = document.getElementById("list")
const showPanel = document.getElementById("show-panel")

//Event Listeners
document.addEventListener("DOMContentLoaded", function() {
    getUser(1)
        .then(userObj => {
            user = userObj
        })
    getBooks()
        .then(booksArray => {
            console.log(booksArray)
            renderAllBooks(booksArray)
        })
});

//Fetches
function getBooks(id) {
    if (!id) {
        return fetch("http://localhost:3000/books")
            .then(resp => resp.json())
    } else {
        return fetch(`http://localhost:3000/books/${id}`)
            .then(resp => resp.json())
    }
}

function getUser(id) {
    return fetch(`http://localhost:3000/users/${id}`)
        .then(resp => resp.json())
}

function likeABook(id, updatedUserLikes) {
    return fetch(`http://localhost:3000/books/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUserLikes)
    })
        .then(resp => resp.json())
}

//Render
function renderAllBooks(booksArray) {
    booksArray.forEach(book => {
        let bookLi = document.createElement("li")
        bookLi.dataset.id = book.id
        let bookInfo = document.createElement("div")
        bookInfo.className = "book-div"
        let bookTitle = document.createElement("h3")
        bookTitle.innerText = book.title
        bookTitle.style.display = "none"
        let bookImage = document.createElement("img")
        bookImage.src = book.img_url
        bookImage.alt = book.title
        bookImage.addEventListener("click", function(e) {
            if (e.target === bookImage && bookTitle.style.display === "none") {
                bookTitle.style.display = "block"
                bookDesc.style.display = "block"
                userLikes.style.display = "block"
            } else if (e.target === bookImage) {
                bookTitle.style.display = "none"
                bookDesc.style.display = "none"
                userLikes.style.display = "none"
            }
        })
        let bookDesc = document.createElement("p")
        bookDesc.innerText = book.description
        bookDesc.style.display = "none"
        let userLikes = document.createElement("ul")
        userLikes.className = "user-likes-list"
        userLikes.style.display = "none"
        book.users.forEach(user => {
            let userLi = document.createElement("li")
            userLi.dataset.id = user.id
            userLi.innerText = user.username
            userLikes.append(userLi)
        })
        let likeBtn = document.createElement("button")
        likeBtn.className = "like-button"
        likeBtn.addEventListener("click", function (e) {
            let myLike = document.createElement("li")
            myLike.innerText = user.username
            book.users.push(user)
            likeABook(bookLi.dataset.id, book)
                .then(updatedBook => {
                    userLikes.append(myLike)
                })
            

        })
        bookInfo.append(bookImage, bookTitle, bookDesc, userLikes, likeBtn)
        bookLi.append(bookInfo)
        bookList.append(bookLi)
    });
}