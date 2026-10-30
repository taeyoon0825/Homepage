export interface Inquiry { business: string; name: string; phone: string; email: string; industry: string; services: string[]; channel: string; message: string; consent: boolean }
export type InquiryErrors = Partial<Record<keyof Inquiry, string>>;
export function validateInquiry(data: Inquiry): InquiryErrors {
 const errors: InquiryErrors = {};
 for (const key of ['business','name','industry','message'] as const) if (!data[key].trim()) errors[key] = '필수 항목을 입력해 주세요.';
 const phone = data.phone.replace(/[\s()-]/g, '');
 if (!/^0\d{8,10}$/.test(phone) && !/^\+[1-9]\d{7,14}$/.test(phone)) errors.phone = '올바른 연락처를 입력해 주세요. 예: 010-1234-5678';
 if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = '이메일 형식을 확인해 주세요.';
 if (!data.consent) errors.consent = '검토용 개인정보 안내를 확인해 주세요.';
 return errors;
}
// 실제 API 연결 지점. 개인정보를 기록하거나 외부로 전송하지 않습니다.
export async function submitInquiry(_data: Inquiry): Promise<{mode:'demo'}> {
 await new Promise(resolve => setTimeout(resolve, 450));
 return {mode:'demo'};
}
