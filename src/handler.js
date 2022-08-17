const { query } = require('@hapi/hapi/lib/validation');
const { nanoid } = require('nanoid');
let containerBooks = [];
let booksForGetRequest = [];

// add book
const addBook = async (request, h) => {
    // add data
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    let finished = false;

    if(readPage == pageCount){
        finished = true;
    }

    const containerBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt
    }

    containerBooks.push(containerBook);

    // check the program
    const index = containerBooks.findIndex((i) => i.id == id);

    if(containerBooks[index].readPage > containerBooks[index].pageCount){
        containerBooks.splice(index, 1);
        booksForGetRequest.splice(index, 1)
        const response = h.response ({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        })
        response.code(400);
        return response;
    }else if(containerBooks[index].name == "" || containerBooks[index].name == undefined){
        containerBooks.splice(index, 1);
        booksForGetRequest.splice(index, 1)
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        })
        response.code(400);
        return response;
        
    } else if(containerBooks.filter((i) => i.id === id).length > 0){
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            }
        })
        response.code(201);
        return response;
    } else {
        containerBooks.splice(index, 1);
        booksForGetRequest.splice(index, 1)
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal ditambahkan'
        });
        response.code(500);
        return response;
    }
};

// get all containerBooks
const getBook = async (request, h) => {
    const {name, finished, reading} = request.query;

    // ketika query request berisi name
    if(name !== undefined){

        const books = [];
        const filterBookByName = containerBooks.filter((i) => i.name.toUpperCase().indexOf(name.toUpperCase()) >= 0)
        filterBookByName.forEach((i) => {
            const container = {
                id: i.id,
                name: i.name,
                publisher: i.publisher,
            };
            books.push(container);
        });
        
        const response = h.response({
            status: 'success',
            data: {
                books,
            }
        });
        response.code(200);
        return response;

    // ketika query request berisi finished
    }else if(finished !== undefined){
        let kondisi = false;
        if(finished == 1){kondisi = true}
        if(finished == 0){kondisi = false}

        const books = [];
        const filterBookByName = containerBooks.filter((i) => i.finished == kondisi)
        filterBookByName.forEach((i) => {
            const container = {
                id: i.id,
                name: i.name,
                publisher: i.publisher,
            };
            books.push(container);
        });

        const response = h.response({
            status: 'success',
            data: {
                books,
            }
        });
        response.code(200);
        return response;

    // ketika query request berisi reading
    }else if(reading !== undefined){
        let kondisi = false;
        if(reading == 1){kondisi = true}
        if(reading == 0){kondisi = false}

        const books = [];
        const filterBookByName = containerBooks.filter((i) => i.reading == kondisi);
        filterBookByName.forEach((i) => {
            const container = {
                id: i.id,
                name: i.name,
                publisher: i.publisher,
            };
            books.push(container);
        });

        const response = h.response({
            status: 'success',
            data: {
                books,
            }
        });
        response.code(200);
        return response;
    }

    // ketika tidak ada query request
    const books = []
    containerBooks.forEach((i) => {
        const container = {
            id: i.id,
            name: i.name,
            publisher: i.publisher,
        };
        books.push(container);
    });

    const response = h.response({
        status: 'success',
        data: {
            books,
        }
    })
    response.code(200)
    return response
}

// get book by id
const getBookById = (request, h) => {
    const {id} = request.params;
    const index = containerBooks.findIndex((i) => i.id === id);

    checkStatus = true;

    if(index == -1){ checkStatus = false; }

    if(checkStatus){
        const response = h.response({
            status: 'success',
            data: {
                book: containerBooks[index],
            }
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
}

// edit data book
const editBook = (request, h) => {
    const {id} = request.params;
    const index = containerBooks.findIndex((i) => i.id == id);
    if(index == -1){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        response.code(404);
        return response
    }

    
    // add data
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const {insertedAt} = containerBooks[index];
    const updatedAt = new Date().toISOString();
    let finished = false;

    if(readPage == pageCount){finished = true};

    const containerEditBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt
    }

    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        })
        response.code(400);
        return response;

    }else if(name == "" || name == undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }

    containerBooks[index] = containerEditBook;
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
}

// delete book
const deleteBook = (request, h) => {
    const {id} = request.params;
    const index = containerBooks.findIndex((i) => i.id == id);

    if(index == -1){
        const response = h.response({
            status: 'fail',
            message: "Buku gagal dihapus. Id tidak ditemukan",
        });
        response.code(404);
        return response;
    }

    containerBooks.splice(index, 1)
    booksForGetRequest.splice(index, 1)
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
}

module.exports = {addBook, getBook, getBookById, editBook, deleteBook};