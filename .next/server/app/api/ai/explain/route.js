"use strict";(()=>{var t={};t.id=729,t.ids=[729],t.modules={399:t=>{t.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:t=>{t.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},454:(t,e,n)=>{n.r(e),n.d(e,{originalPathname:()=>ta,patchFetch:()=>tr,requestAsyncStorage:()=>ts,routeModule:()=>tn,serverHooks:()=>to,staticGenerationAsyncStorage:()=>ti});var s,i,o,a,r,l,d,c,u,h={};n.r(h),n.d(h,{POST:()=>tt});var f=n(9303),p=n(8716),g=n(670),E=n(7070),m=n(1067);/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let C=["user","model","function","system"];(function(t){t.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",t.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",t.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",t.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",t.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT"})(s||(s={})),function(t){t.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",t.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",t.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",t.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",t.BLOCK_NONE="BLOCK_NONE"}(i||(i={})),function(t){t.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",t.NEGLIGIBLE="NEGLIGIBLE",t.LOW="LOW",t.MEDIUM="MEDIUM",t.HIGH="HIGH"}(o||(o={})),function(t){t.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",t.SAFETY="SAFETY",t.OTHER="OTHER"}(a||(a={})),function(t){t.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",t.STOP="STOP",t.MAX_TOKENS="MAX_TOKENS",t.SAFETY="SAFETY",t.RECITATION="RECITATION",t.OTHER="OTHER"}(r||(r={})),function(t){t.TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED",t.RETRIEVAL_QUERY="RETRIEVAL_QUERY",t.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT",t.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY",t.CLASSIFICATION="CLASSIFICATION",t.CLUSTERING="CLUSTERING"}(l||(l={})),function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.AUTO="AUTO",t.ANY="ANY",t.NONE="NONE"}(d||(d={})),function(t){t.STRING="STRING",t.NUMBER="NUMBER",t.INTEGER="INTEGER",t.BOOLEAN="BOOLEAN",t.ARRAY="ARRAY",t.OBJECT="OBJECT"}(c||(c={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O extends Error{constructor(t){super(`[GoogleGenerativeAI Error]: ${t}`)}}class y extends O{constructor(t,e){super(t),this.response=e}}class T extends O{constructor(t,e,n,s){super(t),this.status=e,this.statusText=n,this.errorDetails=s}}class v extends O{}!function(t){t.GENERATE_CONTENT="generateContent",t.STREAM_GENERATE_CONTENT="streamGenerateContent",t.COUNT_TOKENS="countTokens",t.EMBED_CONTENT="embedContent",t.BATCH_EMBED_CONTENTS="batchEmbedContents"}(u||(u={}));class _{constructor(t,e,n,s,i){this.model=t,this.task=e,this.apiKey=n,this.stream=s,this.requestOptions=i}toString(){var t,e;let n=(null===(t=this.requestOptions)||void 0===t?void 0:t.apiVersion)||"v1beta",s=(null===(e=this.requestOptions)||void 0===e?void 0:e.baseUrl)||"https://generativelanguage.googleapis.com",i=`${s}/${n}/${this.model}:${this.task}`;return this.stream&&(i+="?alt=sse"),i}}async function R(t){let e=new Headers;e.append("Content-Type","application/json"),e.append("x-goog-api-client",function(t){let e=[];return(null==t?void 0:t.apiClient)&&e.push(t.apiClient),e.push("genai-js/0.12.0"),e.join(" ")}(t.requestOptions)),e.append("x-goog-api-key",t.apiKey);let n=t.requestOptions.customHeaders;if(n){if(!(n instanceof Headers))try{n=new Headers(n)}catch(t){throw new v(`unable to convert customHeaders value ${JSON.stringify(n)} to Headers: ${t.message}`)}for(let[t,s]of n.entries()){if("x-goog-api-key"===t)throw new v(`Cannot set reserved header name ${t}`);if("x-goog-api-client"===t)throw new v(`Header name ${t} can only be set using the apiClient field`);e.append(t,s)}}return e}async function I(t,e,n,s,i,o){let a=new _(t,e,n,s,o);return{url:a.toString(),fetchOptions:Object.assign(Object.assign({},function(t){let e={};if((null==t?void 0:t.timeout)>=0){let n=new AbortController,s=n.signal;setTimeout(()=>n.abort(),t.timeout),e.signal=s}return e}(o)),{method:"POST",headers:await R(a),body:i})}}async function A(t,e,n,s,i,o){return N(t,e,n,s,i,o,fetch)}async function N(t,e,n,s,i,o,a=fetch){let r;let l=new _(t,e,n,s,o);try{let d=await I(t,e,n,s,i,o);if(!(r=await a(d.url,d.fetchOptions)).ok){let t,e="";try{let n=await r.json();e=n.error.message,n.error.details&&(e+=` ${JSON.stringify(n.error.details)}`,t=n.error.details)}catch(t){}throw new T(`Error fetching from ${l.toString()}: [${r.status} ${r.statusText}] ${e}`,r.status,r.statusText,t)}}catch(e){let t=e;throw e instanceof T||e instanceof v||((t=new O(`Error fetching from ${l.toString()}: ${e.message}`)).stack=e.stack),t}return r}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function S(t){return t.text=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),b(t.candidates[0]))throw new y(`${M(t)}`,t);return function(t){var e,n,s,i;let o=[];if(null===(n=null===(e=t.candidates)||void 0===e?void 0:e[0].content)||void 0===n?void 0:n.parts)for(let e of null===(i=null===(s=t.candidates)||void 0===s?void 0:s[0].content)||void 0===i?void 0:i.parts)e.text&&o.push(e.text);return o.length>0?o.join(""):""}(t)}if(t.promptFeedback)throw new y(`Text not available. ${M(t)}`,t);return""},t.functionCall=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),b(t.candidates[0]))throw new y(`${M(t)}`,t);return console.warn("response.functionCall() is deprecated. Use response.functionCalls() instead."),w(t)[0]}if(t.promptFeedback)throw new y(`Function call not available. ${M(t)}`,t)},t.functionCalls=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),b(t.candidates[0]))throw new y(`${M(t)}`,t);return w(t)}if(t.promptFeedback)throw new y(`Function call not available. ${M(t)}`,t)},t}function w(t){var e,n,s,i;let o=[];if(null===(n=null===(e=t.candidates)||void 0===e?void 0:e[0].content)||void 0===n?void 0:n.parts)for(let e of null===(i=null===(s=t.candidates)||void 0===s?void 0:s[0].content)||void 0===i?void 0:i.parts)e.functionCall&&o.push(e.functionCall);return o.length>0?o:void 0}let x=[r.RECITATION,r.SAFETY];function b(t){return!!t.finishReason&&x.includes(t.finishReason)}function M(t){var e,n,s;let i="";if((!t.candidates||0===t.candidates.length)&&t.promptFeedback)i+="Response was blocked",(null===(e=t.promptFeedback)||void 0===e?void 0:e.blockReason)&&(i+=` due to ${t.promptFeedback.blockReason}`),(null===(n=t.promptFeedback)||void 0===n?void 0:n.blockReasonMessage)&&(i+=`: ${t.promptFeedback.blockReasonMessage}`);else if(null===(s=t.candidates)||void 0===s?void 0:s[0]){let e=t.candidates[0];b(e)&&(i+=`Candidate was blocked due to ${e.finishReason}`,e.finishMessage&&(i+=`: ${e.finishMessage}`))}return i}function $(t){return this instanceof $?(this.v=t,this):new $(t)}"function"==typeof SuppressedError&&SuppressedError;/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let H=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;async function P(t){let e=[],n=t.getReader();for(;;){let{done:t,value:s}=await n.read();if(t)return S(function(t){let e=t[t.length-1],n={promptFeedback:null==e?void 0:e.promptFeedback};for(let e of t)if(e.candidates)for(let t of e.candidates){let e=t.index;if(n.candidates||(n.candidates=[]),n.candidates[e]||(n.candidates[e]={index:t.index}),n.candidates[e].citationMetadata=t.citationMetadata,n.candidates[e].finishReason=t.finishReason,n.candidates[e].finishMessage=t.finishMessage,n.candidates[e].safetyRatings=t.safetyRatings,t.content&&t.content.parts){n.candidates[e].content||(n.candidates[e].content={role:t.content.role||"user",parts:[]});let s={};for(let i of t.content.parts)i.text&&(s.text=i.text),i.functionCall&&(s.functionCall=i.functionCall),0===Object.keys(s).length&&(s.text=""),n.candidates[e].content.parts.push(s)}}return n}(e));e.push(s)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function U(t,e,n,s){return function(t){let[e,n]=(function(t){let e=t.getReader();return new ReadableStream({start(t){let n="";return function s(){return e.read().then(({value:e,done:i})=>{let o;if(i){if(n.trim()){t.error(new O("Failed to parse stream"));return}t.close();return}let a=(n+=e).match(H);for(;a;){try{o=JSON.parse(a[1])}catch(e){t.error(new O(`Error parsing JSON response: "${a[1]}"`));return}t.enqueue(o),a=(n=n.substring(a[0].length)).match(H)}return s()})}()}})})(t.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0}))).tee();return{stream:function(t){return function(t,e,n){if(!Symbol.asyncIterator)throw TypeError("Symbol.asyncIterator is not defined.");var s,i=n.apply(t,e||[]),o=[];return s={},a("next"),a("throw"),a("return"),s[Symbol.asyncIterator]=function(){return this},s;function a(t){i[t]&&(s[t]=function(e){return new Promise(function(n,s){o.push([t,e,n,s])>1||r(t,e)})})}function r(t,e){try{var n;(n=i[t](e)).value instanceof $?Promise.resolve(n.value.v).then(l,d):c(o[0][2],n)}catch(t){c(o[0][3],t)}}function l(t){r("next",t)}function d(t){r("throw",t)}function c(t,e){t(e),o.shift(),o.length&&r(o[0][0],o[0][1])}}(this,arguments,function*(){let e=t.getReader();for(;;){let{value:t,done:n}=yield $(e.read());if(n)break;yield yield $(S(t))}})}(e),response:P(n)}}(await A(e,u.STREAM_GENERATE_CONTENT,t,!0,JSON.stringify(n),s))}async function L(t,e,n,s){let i=await A(e,u.GENERATE_CONTENT,t,!1,JSON.stringify(n),s);return{response:S(await i.json())}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function D(t){if(null!=t){if("string"==typeof t)return{role:"system",parts:[{text:t}]};if(t.text)return{role:"system",parts:[t]};if(t.parts)return t.role?t:{role:"system",parts:t.parts}}}function G(t){let e=[];if("string"==typeof t)e=[{text:t}];else for(let n of t)"string"==typeof n?e.push({text:n}):e.push(n);return function(t){let e={role:"user",parts:[]},n={role:"function",parts:[]},s=!1,i=!1;for(let o of t)"functionResponse"in o?(n.parts.push(o),i=!0):(e.parts.push(o),s=!0);if(s&&i)throw new O("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");if(!s&&!i)throw new O("No content is provided for sending chat message.");return s?e:n}(e)}function F(t){let e;return e=t.contents?t:{contents:[G(t)]},t.systemInstruction&&(e.systemInstruction=D(t.systemInstruction)),e}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let j=["text","inlineData","functionCall","functionResponse"],B={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall"],system:["text"]},Y="SILENT_ERROR";class k{constructor(t,e,n,s){this.model=e,this.params=n,this.requestOptions=s,this._history=[],this._sendPromise=Promise.resolve(),this._apiKey=t,(null==n?void 0:n.history)&&(function(t){let e=!1;for(let n of t){let{role:t,parts:s}=n;if(!e&&"user"!==t)throw new O(`First content should be with role 'user', got ${t}`);if(!C.includes(t))throw new O(`Each item should include role field. Got ${t} but valid roles are: ${JSON.stringify(C)}`);if(!Array.isArray(s))throw new O("Content should have 'parts' property with an array of Parts");if(0===s.length)throw new O("Each Content should have at least one part");let i={text:0,inlineData:0,functionCall:0,functionResponse:0,fileData:0};for(let t of s)for(let e of j)e in t&&(i[e]+=1);let o=B[t];for(let e of j)if(!o.includes(e)&&i[e]>0)throw new O(`Content with role '${t}' can't contain '${e}' part`);e=!0}}(n.history),this._history=n.history)}async getHistory(){return await this._sendPromise,this._history}async sendMessage(t){var e,n,s,i,o;let a;await this._sendPromise;let r=G(t),l={safetySettings:null===(e=this.params)||void 0===e?void 0:e.safetySettings,generationConfig:null===(n=this.params)||void 0===n?void 0:n.generationConfig,tools:null===(s=this.params)||void 0===s?void 0:s.tools,toolConfig:null===(i=this.params)||void 0===i?void 0:i.toolConfig,systemInstruction:null===(o=this.params)||void 0===o?void 0:o.systemInstruction,contents:[...this._history,r]};return this._sendPromise=this._sendPromise.then(()=>L(this._apiKey,this.model,l,this.requestOptions)).then(t=>{var e;if(t.response.candidates&&t.response.candidates.length>0){this._history.push(r);let n=Object.assign({parts:[],role:"model"},null===(e=t.response.candidates)||void 0===e?void 0:e[0].content);this._history.push(n)}else{let e=M(t.response);e&&console.warn(`sendMessage() was unsuccessful. ${e}. Inspect response object for details.`)}a=t}),await this._sendPromise,a}async sendMessageStream(t){var e,n,s,i,o;await this._sendPromise;let a=G(t),r={safetySettings:null===(e=this.params)||void 0===e?void 0:e.safetySettings,generationConfig:null===(n=this.params)||void 0===n?void 0:n.generationConfig,tools:null===(s=this.params)||void 0===s?void 0:s.tools,toolConfig:null===(i=this.params)||void 0===i?void 0:i.toolConfig,systemInstruction:null===(o=this.params)||void 0===o?void 0:o.systemInstruction,contents:[...this._history,a]},l=U(this._apiKey,this.model,r,this.requestOptions);return this._sendPromise=this._sendPromise.then(()=>l).catch(t=>{throw Error(Y)}).then(t=>t.response).then(t=>{if(t.candidates&&t.candidates.length>0){this._history.push(a);let e=Object.assign({},t.candidates[0].content);e.role||(e.role="model"),this._history.push(e)}else{let e=M(t);e&&console.warn(`sendMessageStream() was unsuccessful. ${e}. Inspect response object for details.`)}}).catch(t=>{t.message!==Y&&console.error(t)}),l}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function K(t,e,n,s){return(await A(e,u.COUNT_TOKENS,t,!1,JSON.stringify(Object.assign(Object.assign({},n),{model:e})),s)).json()}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function q(t,e,n,s){return(await A(e,u.EMBED_CONTENT,t,!1,JSON.stringify(n),s)).json()}async function V(t,e,n,s){let i=n.requests.map(t=>Object.assign(Object.assign({},t),{model:e}));return(await A(e,u.BATCH_EMBED_CONTENTS,t,!1,JSON.stringify({requests:i}),s)).json()}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class J{constructor(t,e,n){this.apiKey=t,e.model.includes("/")?this.model=e.model:this.model=`models/${e.model}`,this.generationConfig=e.generationConfig||{},this.safetySettings=e.safetySettings||[],this.tools=e.tools,this.toolConfig=e.toolConfig,this.systemInstruction=D(e.systemInstruction),this.requestOptions=n||{}}async generateContent(t){let e=F(t);return L(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction},e),this.requestOptions)}async generateContentStream(t){let e=F(t);return U(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction},e),this.requestOptions)}startChat(t){return new k(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction},t),this.requestOptions)}async countTokens(t){let e=F(t);return K(this.apiKey,this.model,e,this.requestOptions)}async embedContent(t){let e="string"==typeof t||Array.isArray(t)?{content:G(t)}:t;return q(this.apiKey,this.model,e,this.requestOptions)}async batchEmbedContents(t){return V(this.apiKey,this.model,t,this.requestOptions)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X{constructor(t){this.apiKey=t}getGenerativeModel(t,e){if(!t.model)throw new O("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");return new J(this.apiKey,t,e)}}var W=n(1913),Z=n(3493);let z=new X(process.env.GOOGLE_API_KEY).getGenerativeModel({model:"gemini-1.5-flash"}),Q=m.Ry({statValues:m.IX(m.Ry({statCode:m.Z_(),value:m.Rx().int().min(1).max(99)})),positionCode:m.Z_(),seasonId:m.Z_().optional(),plan:m.IX(m.Ry({statCode:m.Z_(),pointsAdded:m.Rx().int().min(1).max(2)})).optional(),question:m.Z_().optional()});async function tt(t){try{let e;let n=await t.json(),s=Q.safeParse(n);if(!s.success)return E.NextResponse.json({error:"Invalid request body",details:s.error.format()},{status:400});let{statValues:i,positionCode:o,seasonId:a,plan:r,question:l}=s.data,d=await Z._.position.findUnique({where:{code:o},include:{weights:{where:a?{seasonId:a}:{seasonId:null},include:{stat:!0}}}});if(!d)return E.NextResponse.json({error:"Position not found"},{status:404});let c={},u={};for(let t of d.weights)c[t.statCode]=t.weight,u[t.statCode]=t.stat.nameVi;if(r&&r.length>0){let t=Object.fromEntries(i.map(t=>[t.statCode,t.value])),n={...t};for(let e of r)n[e.statCode]=(t[e.statCode]||0)+e.pointsAdded;let s=te(t,c),o=te(n,c);e={baseOvr:s,optimizedOvr:o,ovrGain:o-s,plan:r,trainingsUsed:r.reduce((t,e)=>t+e.pointsAdded,0),statsTrained:r.length,alternatives:[]}}else e=(0,W._)(i,c);let h=i.map(t=>`- ${u[t.statCode]||t.statCode}: ${t.value} (hệ số: ${c[t.statCode]||0})`).join("\n"),f=e.plan.length>0?e.plan.map(t=>`+${t.pointsAdded} ${u[t.statCode]||t.statCode}`).join(", "):"Kh\xf4ng đ\xe0o tạo th\xeam",p=`Bạn l\xe0 chuy\xean gia FIFA Online 4, gi\xfap người chơi tối ưu h\xf3a đ\xe0o tạo cầu thủ.
C\xf4ng thức OVR: Trung b\xecnh cộng c\xf3 trọng số (weighted average) = Tổng(chỉ số \xd7 hệ số) / Tổng hệ số, l\xe0m tr\xf2n.

Dữ liệu cầu thủ:
${h}

Vị tr\xed: ${d.nameVi} (${o})
OVR gốc: ${e.baseOvr}
OVR sau tối ưu: ${e.optimizedOvr} (+${e.ovrGain})
Phương \xe1n đề xuất: ${f}
Số lượt đ\xe0o tạo: ${e.trainingsUsed}
Số chỉ số đ\xe0o tạo: ${e.statsTrained}

Quy tắc tie-break: Ưu ti\xean OVR cao nhất → \xedt lượt đ\xe0o tạo hơn → \xedt chỉ số hơn.
H\xe3y giải th\xedch bằng tiếng Việt tự nhi\xean, dễ hiểu.`,g=l?`Người d\xf9ng hỏi: "${l}". H\xe3y trả lời dựa tr\xean dữ liệu tr\xean.`:"H\xe3y giải th\xedch tại sao phương \xe1n đ\xe0o tạo n\xe0y l\xe0 tối ưu, v\xe0 tại sao kh\xf4ng chọn c\xe1c chỉ số kh\xe1c.",m=(await z.generateContent({systemInstruction:p,contents:[{role:"user",parts:[{text:g}]}],generationConfig:{maxOutputTokens:1e3}})).response.text();return E.NextResponse.json({explanation:m})}catch(t){return console.error("Error generating AI explanation:",t),E.NextResponse.json({error:"Failed to generate explanation"},{status:500})}}function te(t,e){let n=0,s=0;for(let[i,o]of Object.entries(t)){let t=e[i]??0;t>0&&(n+=o*t,s+=t)}return s>0?Math.round(n/s):0}let tn=new f.AppRouteRouteModule({definition:{kind:p.x.APP_ROUTE,page:"/api/ai/explain/route",pathname:"/api/ai/explain",filename:"route",bundlePath:"app/api/ai/explain/route"},resolvedPagePath:"D:\\fco-tool\\ovr-calculating-tool\\app\\api\\ai\\explain\\route.ts",nextConfigOutput:"",userland:h}),{requestAsyncStorage:ts,staticGenerationAsyncStorage:ti,serverHooks:to}=tn,ta="/api/ai/explain/route";function tr(){return(0,g.patchFetch)({serverHooks:to,staticGenerationAsyncStorage:ti})}},1913:(t,e,n)=>{n.d(e,{_:()=>i});var s=n(5024);function i(t,e,n=5,i=3){let o=function(t,e,n=5){let i=[],o=t.filter(t=>(e[t.statCode]??0)>0).sort((t,n)=>(e[n.statCode]??0)-(e[t.statCode]??0)),a=o.map(t=>t.statCode),r=Object.fromEntries(o.map(t=>[t.statCode,t.value]));function l(t){let n={...r},i=0,o=0;for(let[e,s]of Object.entries(t))s>0&&(n[e]=r[e]+s,i+=s,o++);let a=(0,s.Y)(n,e);return{plan:Object.entries(t).filter(([,t])=>t>0).map(([t,e])=>({statCode:t,pointsAdded:e})),ovr:a,trainingsUsed:i,statsTrained:o}}(0,s.Y)(r,e);let d={};for(let t of a)d[t]=0;return i.push(l(d)),function t(e,s,o){if(s>n)return;if(e>=a.length){s>0&&i.push(l({...o}));return}let r=a[e];for(let n=1;n<=2;n++)o[r]=n,t(e+1,s+1,o),o[r]=0;t(e+1,s,o)}(0,0,d),i}(t,e,n),a=o[0].ovr;o.sort((t,e)=>e.ovr!==t.ovr?e.ovr-t.ovr:t.trainingsUsed!==e.trainingsUsed?t.trainingsUsed-e.trainingsUsed:t.statsTrained-e.statsTrained);let r=o[0],l=o.filter(t=>t.ovr===r.ovr&&(t.trainingsUsed!==r.trainingsUsed||t.statsTrained!==r.statsTrained)).slice(0,i).map(t=>({baseOvr:a,optimizedOvr:t.ovr,ovrGain:t.ovr-a,plan:t.plan,trainingsUsed:t.trainingsUsed,statsTrained:t.statsTrained,alternatives:[]}));return{baseOvr:a,optimizedOvr:r.ovr,ovrGain:r.ovr-a,plan:r.plan,trainingsUsed:r.trainingsUsed,statsTrained:r.statsTrained,alternatives:l}}},5024:(t,e,n)=>{function s(t,e){let n=[],s=0,i=0;for(let{statCode:o,value:a}of t){let t=e[o]??0;if(t>0){let e=a*t;s+=e,i+=t,n.push({statCode:o,value:a,weight:t,contribution:e})}}return{ovr:i>0?Math.round(s/i):0,weightedSum:s,totalWeight:i,details:n}}function i(t,e){let n=0,s=0;for(let[i,o]of Object.entries(t)){let t=e[i]??0;t>0&&(n+=o*t,s+=t)}return s>0?Math.round(n/s):0}n.d(e,{W:()=>s,Y:()=>i})},3493:(t,e,n)=>{n.d(e,{_:()=>i});let s=require("@prisma/client"),i=globalThis.prisma??new s.PrismaClient({log:["error"]})}};var e=require("../../../../webpack-runtime.js");e.C(t);var n=t=>e(e.s=t),s=e.X(0,[948,972,67],()=>n(454));module.exports=s})();