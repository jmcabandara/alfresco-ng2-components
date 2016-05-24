/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';

import { AlfrescoSettingsService } from 'ng2-alfresco-core/dist/ng2-alfresco-core';

declare let AlfrescoApi: any;

/**
 * Internal service used by Document List component.
 */
@Injectable()
export class AlfrescoService {

    private _host: string = 'http://127.0.0.1:8080';
    private _baseUrlPath: string = '/alfresco/api/-default-/public/alfresco/versions/1';

    constructor(private http: Http,
                private settings: AlfrescoSettingsService) {
        if (settings) {
            this._host = settings.host;
        }
    }

    public get host(): string {
        return this._host;
    }

    public set host(value: string) {
        this._host = value;
    }

    private getBaseUrl(): string {
        return this.host + this._baseUrlPath;
    }

    private getAlfrescoTicket() {
        return localStorage.getItem('token');
    }

    private getAlfrescoClient() {
        let defaultClient = new AlfrescoApi.ApiClient();
        defaultClient.basePath = this.getBaseUrl();

        // Configure HTTP basic authorization: basicAuth
        let basicAuth = defaultClient.authentications['basicAuth'];
        basicAuth.username = 'ROLE_TICKET';
        basicAuth.password = this.getAlfrescoTicket();

        return defaultClient;
    }

    private getSearchNodesPromise(term: string) {
        let alfrescoClient = this.getAlfrescoClient();
        let apiInstance = new AlfrescoApi.SearchApi(alfrescoClient);
        let nodeId = '-root-';
        let opts = {
            include: ['path'],
            rootNodeId: nodeId
        };
        return apiInstance.liveSearchNodes(term, opts);
    }

    /**
     * Execute a search against the repository
     *
     * @param term Search term
     * @returns {Observable<NodePaging>} Search results
     */
    getLiveSearchResults(term: string) {
        return Observable.fromPromise(this.getSearchNodesPromise(term))
            .map(res => <any> res)
            .do(data => console.log('Search data', data)) // eyeball results in the console
            .catch(this.handleError);
    }

    /**
     * Get thumbnail URL for the given document node.
     * @param document Node to get URL for.
     * @returns {string} URL address.
     */
    getDocumentThumbnailUrl(document: any) {
        return this.getContentUrl(document) + '/thumbnails/doclib?c=queue&ph=true&lastModified=1&alf_ticket=' + this.getAlfrescoTicket();
    }

    /**
     * Get content URL for the given node.
     * @param document Node to get URL for.
     * @returns {string} URL address.
     */
    getContentUrl(document: any) {
        return this._host +
            '/alfresco/service/api/node/workspace/SpacesStore/' +
            document.entry.id + '/content';
    }

    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error || 'Server error');
    }
}