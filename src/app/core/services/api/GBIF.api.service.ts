import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RootObject } from '../../models/GBIF/apiResult.model';
import { Media } from '../../models/GBIF/media.model';
import { Taxa } from '../../models/GBIF/taxa.model';

@Injectable({
    providedIn: 'root',
})
export class GBIFApiService {
    private baseApi = 'https://api.gbif.org/v1';

    constructor(private http: HttpClient) { }

    getChildren(id: number): Observable<Array<Taxa>> {
        if (!id) {
            return of(undefined);
        }

        const url = `${this.baseApi}/species/${id}/children`;
        return this.http.get<RootObject<Taxa>>(url).pipe(
            map(rs => rs.results ? rs.results : undefined)
        );
    }

    getMediaUrl(id: number): Observable<Array<string>> {
        if (!id) {
            return of(undefined);
        }

        const url = `${this.baseApi}/taxa/${id}/media`;
        return this.http.get<RootObject<Media>>(url).pipe(map(rs => {
            if (rs.results && rs.results.length) {
                return rs.results.map(m => m.identifier);
            }

            return undefined;
        }));
    }
}
