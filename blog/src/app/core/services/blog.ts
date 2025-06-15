import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  setDoc,
  Firestore,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BlogService {
  constructor(private firestore: Firestore) {}

  getBlogs(): Observable<any[]> {
    const ref = collection(this.firestore, 'blogs');
    return collectionData(ref, { idField: 'id' });
  }

  getBlog(id: string): Observable<any> {
    const ref = doc(this.firestore, `blogs/${id}`);
    return from(
      getDoc(ref).then((snapshot) => {
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() };
        } else {
          throw new Error('Blog not found');
        }
      })
    );
  }

  addBlog(blog: any) {
    const ref = collection(this.firestore, 'blogs');
    return addDoc(ref, blog);
  }

  updateBlog(id: string, blog: any) {
    const ref = doc(this.firestore, `blogs/${id}`);
    return setDoc(ref, blog);
  }

  deleteBlog(id: string) {
    const ref = doc(this.firestore, `blogs/${id}`);
    return deleteDoc(ref);
  }
}
