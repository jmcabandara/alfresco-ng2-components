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

import { FormService } from './src/services/form.service';
import { EcmModelService } from './src/services/ecm-model.service';
import { NodeService } from './src/services/node.service';

export * from './src/components/activiti-form.component';
export * from './src/services/form.service';
export * from './src/components/widgets/index';
export * from  './src/services/ecm-model.service';
export * from  './src/services/node.service';


export const ATIVITI_FORM_PROVIDERS: [any] = [
    FormService,
    EcmModelService,
    NodeService
];
