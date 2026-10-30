import {createServer} from 'vite';
import {renderToString} from 'react-dom/server';
import {createElement} from 'react';
import assert from 'node:assert/strict';
const server=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {default:App}=await server.ssrLoadModule('/src/App.tsx');
 const html=renderToString(createElement(App));
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,'Duplicate element IDs');
 for(const [,id] of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(id),`Missing anchor: ${id}`);
 assert.equal((html.match(/class="service-card/g)||[]).length,6);
 assert.equal((html.match(/role="tab"/g)||[]).length,4);
 assert.equal((html.match(/class="faq-number"/g)||[]).length,8);
 assert.ok(html.includes('현재 테스트용 폼입니다. 실제로 전송되지 않습니다.'));
 const {validateInquiry,submitInquiry}=await server.ssrLoadModule('/src/lib/inquiry.ts');
 const valid={business:'테스트 기업',name:'담당자',phone:'010-1234-5678',email:'',industry:'교육',services:['seo'],channel:'',message:'검색 정보 정비 상담',consent:true};
 assert.deepEqual(validateInquiry(valid),{});
 for(const key of ['business','name','industry','message'])assert.ok(validateInquiry({...valid,[key]:'   '})[key]);
 for(const phone of ['01012345678','02-123-4567','+82 10 1234 5678'])assert.equal(validateInquiry({...valid,phone}).phone,undefined);
 for(const phone of ['','abc','010123','12345678901'])assert.ok(validateInquiry({...valid,phone}).phone);
 assert.ok(validateInquiry({...valid,email:'incorrect'}).email);
 assert.equal(validateInquiry({...valid,email:'hello@example.com'}).email,undefined);
 assert.ok(validateInquiry({...valid,consent:false}).consent);
 assert.deepEqual(await submitInquiry(valid),{mode:'demo'});
 console.log('PASS: React rendering, unique IDs, internal links, services, tabs, FAQs, form validation and demo submission');
}finally{await server.close();}
