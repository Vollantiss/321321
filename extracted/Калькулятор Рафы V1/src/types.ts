export interface PaperType {
  id: string;
  name: string;
  pricePerSheet: number; // цена за лист SRA3
}

export interface ExtraService {
  id: string;
  name: string;
  pricePerUnit: number; // цена за единицу
}

export interface FormatOption {
  id: string;
  label: string;
  width: number;  // мм
  height: number; // мм
}

export const SRA3_WIDTH = 320; // мм
export const SRA3_HEIGHT = 450; // мм

export const FORMAT_OPTIONS: FormatOption[] = [
  { id: 'a3', label: 'A3', width: 297, height: 420 },
  { id: 'a4', label: 'A4', width: 210, height: 297 },
  { id: 'a5', label: 'A5', width: 148, height: 210 },
  { id: 'a6', label: 'A6', width: 105, height: 148 },
  { id: 'card', label: 'Визитка (90×50)', width: 90, height: 50 },
];
