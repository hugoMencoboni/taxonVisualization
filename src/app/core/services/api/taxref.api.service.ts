import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AutocompleteResponseEncapsulation } from '../../models/taxRef/autocomplete.model';
import { ChrildrenResponseEncapsulation } from '../../models/taxRef/children.model';
import { MediaResponseEncapsulation } from '../../models/taxRef/media.model';
import { Taxa } from '../../models/taxRef/taxa.model';

@Injectable({
    providedIn: 'root',
})
export class TaxRefApiService {
    private baseApi = 'https://taxref.mnhn.fr/api';

    constructor(private http: HttpClient) { }

    getByName(term: string): Observable<Array<Taxa>> {
        if (!term) {
            return of(undefined);
        }

        const params = new HttpParams()
            .set('frenchVernacularNames', term)
            .set('version', '13.0')
            .set('size', '10');
        const url = `${this.baseApi}/taxa/search`;
        return this.http.get<AutocompleteResponseEncapsulation>(url, { params }).pipe(
            map(rs => rs._embedded ? rs._embedded.taxa : undefined)
        );
    }

    getChildren(id: number): Observable<Array<Taxa>> {
        if (!id) {
            return of(undefined);
        }

        const url = `${this.baseApi}/taxa/${id}/children`;
        return this.http.get<ChrildrenResponseEncapsulation>(url).pipe(
            map(rs => rs._embedded ? rs._embedded.taxa : undefined)
        );
    }

    getMediaUrl(id: number): Observable<Array<string>> {
        if (!id) {
            return of(undefined);
        }

        const url = `${this.baseApi}/taxa/${id}/media`;
        return this.http.get<MediaResponseEncapsulation>(url).pipe(map(rs => {
            if (rs._embedded && rs._embedded.media && rs._embedded.media.length) {
                return rs._embedded.media.map(m => m._links.file.href);
            }

            return undefined;
        }));
    }
}
