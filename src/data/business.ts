export const BUSINESS_TYPES = [
  "ธุรกิจบริการ",
  "ธุรกิจการค้า",
  "ธุรกิจอาหารและเครื่องดื่ม",
  "ธุรกิจการเงินและการลงทุน",
  "ธุรกิจเทคโนโลยีและนวัตกรรม",
  "ธุรกิจโลจิสติกส์และซัพพลายเชน",
  "ธุรกิจการตลาดและโฆษณา",
  "ธุรกิจสิ่งแวดล้อม",
  "ธุรกิจสุขภาพ/ความงาม",
  "ธุรกิจระหว่างประเทศ",
  "ธุรกิจสร้างสรรค์และสื่อ",
  "ธุรกิจการเกษตร",
  "ธุรกิจท่องเที่ยว",
  "ธุรกิจเพื่อสังคม",
] as const;

export type BusinessType = typeof BUSINESS_TYPES[number];

export type Category = "skills" | "preferences" | "readiness" | "motivation";

export interface Question {
  id: string;
  text: string;
  category: Category;
  weights: Partial<Record<BusinessType, number>>; // 0..1 (relative weight)
}
