import { Injectable } from "@angular/core";

import { QueryConfig } from "./../../models/query-config";

import { map } from "rxjs/operators";

import { AngularFirestore, Query } from '@angular/fire/firestore';

@Injectable({
  providedIn: "root"
})
export class PaginationService {
  private queryConfig: QueryConfig;
  constructor(private firestore: AngularFirestore) {}

  getCollectionData(
    path,
    field?,
    orderByField?,
    fieldValue?,
    pageNumber?,
    lastSnapshot?
  ) {
    this.queryConfig = {
      path: path,
      field: field,
      orderByField: orderByField,
      limit: 5,
      reverse: true,
      pageNumber: pageNumber
    };
    let queryRef: Query = this.firestore
      .collection<any>(this.queryConfig.path)
      .ref.orderBy(
        this.queryConfig.orderByField,
        this.queryConfig.reverse ? "asc" : "desc"
      );
    queryRef = queryRef.where(this.queryConfig.field, "==", fieldValue);
    if (this.queryConfig.pageNumber > 1) {
      queryRef = queryRef.startAfter(lastSnapshot);
    }
    let data = this.firestore
      .collection(this.queryConfig.path, ref =>
        queryRef.limit(this.queryConfig.limit)
      )
      .snapshotChanges();
    return data.pipe(
      map(actions =>
        actions.map(a => {
          let data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  getCollection(path, orderByField?, pageNumber?, lastSnapshot?) {
    this.queryConfig = {
      path: path,
      orderByField: orderByField,
      limit: 5,
      reverse: true,
      pageNumber: pageNumber
    };
    let queryRef: Query = this.firestore
      .collection<any>(this.queryConfig.path)
      .ref.orderBy(
        this.queryConfig.orderByField,
        this.queryConfig.reverse ? "asc" : "desc"
      );
    if (this.queryConfig.pageNumber > 1) {
      queryRef = queryRef.startAfter(lastSnapshot);
    }
    let data = this.firestore
      .collection(this.queryConfig.path, ref =>
        queryRef.limit(this.queryConfig.limit)
      )
      .snapshotChanges();
    return data.pipe(
      map(actions =>
        actions.map(a => {
          let data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  getCollectionCursors(path, field, orderByField, fieldValue, pageNum) {
    // let limit = pageNum == 1 ? 5 : (pageNum - 1) * 5;
    this.queryConfig = {
      path: path,
      field: field,
      orderByField: orderByField,
      reverse: true,
      limit: pageNum == 1 ? 5 : (pageNum - 1) * 5
    };
    let queryRef: Query = this.firestore
      .collection<any>(this.queryConfig.path)
      .ref.orderBy(
        this.queryConfig.orderByField,
        this.queryConfig.reverse ? "asc" : "desc"
      );
    queryRef = queryRef.where(this.queryConfig.field, "==", fieldValue);
    let data = this.firestore
      .collection(this.queryConfig.path, ref =>
        queryRef.limit(this.queryConfig.limit)
      )
      .snapshotChanges();
    return data.pipe(
      map(actions =>
        actions.map(a => {
          let docs = a.payload.doc;
          return docs;
        })
      )
    );
  }

  getCollectionNext(path, field, orderByField, fieldValue, lastSnapshot) {
    this.queryConfig = {
      path: path,
      field: field,
      orderByField: orderByField,
      reverse: true,
      limit: 5
    };
    let queryRef: Query = this.firestore
      .collection<any>(this.queryConfig.path)
      .ref.orderBy(this.queryConfig.orderByField, "asc");
    queryRef = queryRef.where(this.queryConfig.field, "==", fieldValue);
    queryRef = queryRef.startAfter(lastSnapshot);
    let data = this.firestore
      .collection(this.queryConfig.path, ref =>
        queryRef.limit(this.queryConfig.limit)
      )
      .snapshotChanges();
    return data.pipe(
      map(actions =>
        actions.map(a => {
          let data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  getCollectionPrev(path, field, orderByField, fieldValue, lastSnapshot) {
    this.queryConfig = {
      path: path,
      field: field,
      orderByField: orderByField,
      reverse: true,
      limit: 5
    };
    let queryRef: Query = this.firestore
      .collection<any>(this.queryConfig.path)
      .ref.orderBy(this.queryConfig.orderByField, "asc");
    queryRef = queryRef.where(this.queryConfig.field, "==", fieldValue);
    queryRef = queryRef.endAt(lastSnapshot);
    let data = this.firestore
      .collection(this.queryConfig.path, ref =>
        queryRef.limitToLast(this.queryConfig.limit)
      )
      .snapshotChanges();
    return data.pipe(
      map(actions =>
        actions.map(a => {
          let data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  getPaginationQueryCursors(path, orderByField, pageNum) {
    this.queryConfig = {
      path: path,
      orderByField: orderByField,
      reverse: true,
      limit: pageNum == 1 ? 5 : (pageNum - 1) * 5
    };
    let queryRef: Query = this.firestore
      .collection<any>(this.queryConfig.path)
      .ref.orderBy(
        this.queryConfig.orderByField,
        this.queryConfig.reverse ? "asc" : "desc"
      );
    let data = this.firestore
      .collection(this.queryConfig.path, ref =>
        queryRef.limit(this.queryConfig.limit)
      )
      .snapshotChanges();
    return data.pipe(
      map(actions =>
        actions.map(a => {
          let docs = a.payload.doc;
          return docs;
        })
      )
    );
  }

  nextPageData(path, orderByField, lastSnapshot) {
    this.queryConfig = {
      path: path,
      orderByField: orderByField,
      reverse: true,
      limit: 5
    };
    let queryRef: Query = this.firestore
      .collection<any>(this.queryConfig.path)
      .ref.orderBy(this.queryConfig.orderByField, "asc");
    queryRef = queryRef.startAfter(lastSnapshot);
    let data = this.firestore
      .collection(this.queryConfig.path, ref =>
        queryRef.limit(this.queryConfig.limit)
      )
      .snapshotChanges();
    return data.pipe(
      map(actions =>
        actions.map(a => {
          let data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  previousPageData(path, orderByField, lastSnapshot) {
    this.queryConfig = {
      path: path,
      orderByField: orderByField,
      reverse: true,
      limit: 5
    };
    let queryRef: Query = this.firestore
      .collection<any>(this.queryConfig.path)
      .ref.orderBy(this.queryConfig.orderByField, "asc");
    queryRef = queryRef.endAt(lastSnapshot);
    let data = this.firestore
      .collection(this.queryConfig.path, ref =>
        queryRef.limitToLast(this.queryConfig.limit)
      )
      .snapshotChanges();
    return data.pipe(
      map(actions =>
        actions.map(a => {
          let data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  getCollectionSize(endPoint) {
    return this.firestore
      .collection<any>(endPoint)
      .ref.get()
      .then(snapShot => {
        return snapShot.size;
      });
  }

  getCollectionSizeQuery(endPoint, field, value) {
    return this.firestore
      .collection<any>(endPoint)
      .ref.where(field, "==", value)
      .get()
      .then(snapShot => {
        return snapShot.size;
      });
  }
}
