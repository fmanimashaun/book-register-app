import { AsyncPipe, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, AsyncPipe, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  bookObj: Book = new Book();
  http = inject(HttpClient);
  bookList: Book[] = [];

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks() {
    this.http.get<Book[]>("/api/books").subscribe((res: Book[]) => {
      this.bookList = res;
    });
  }

  onSaveBook() {
    if (this.bookObj._id) {
      // Update existing book
      this.http.put<Book>(`/api/books/${this.bookObj._id}`, this.bookObj).subscribe(() => {
        alert("Book Updated Successfully");
        this.getBooks();
        this.resetForm();
      });
    } else {
      // Create new book
      this.http.post<Book>("/api/books", this.bookObj).subscribe(() => {
        alert("Book Created Successfully");
        this.getBooks();
        this.resetForm();
      });
    }
  }

  onEdit(book: Book) {
    this.bookObj = { ...book };
  }

  onDelete(id: string) {
    const isDelete = confirm("Are you sure you want to delete this book?");
    if (isDelete) {
      this.http.delete<Book>(`/api/books/${id}`).subscribe(() => {
        alert("Book Deleted Successfully");
        this.getBooks();
      });
    }
  }

  resetForm() {
    this.bookObj = new Book();
  }
}

export class Book {
  _id?: string;
  name: string;
  isbn: string;
  author: string;
  pages: number;

  constructor() {
    this.name = '';
    this.isbn = '';
    this.author = '';
    this.pages = 0;
  }
}