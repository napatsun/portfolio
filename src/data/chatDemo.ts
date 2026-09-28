/**
 * Illustrative chat demo — LINE Chatbot RAG project.
 *
 * HONESTY CONTRACT (agent.md §2 "Never invent content"):
 * docs/content.md §5 suggests "an animated chat demo instead of a data
 * chart" for this project. These bubbles are a MOCK conversation written
 * purely to illustrate the chatbot's domain (café opening hours, menu
 * prices, Thai-language replies, per the project bullets) — they are not a
 * real customer log and must never be presented as one. The ChatDemo
 * component renders an always-visible caption saying exactly that.
 */

export interface ChatDemoMessage {
  /** Which side of the mock conversation the bubble belongs to. */
  from: 'user' | 'bot'
  /** Illustrative message text (mock, not a real log). */
  text: string
}

export const illustrativeChatDemo: ChatDemoMessage[] = [
  { from: 'user', text: 'สวัสดีค่ะ ร้านเปิดกี่โมงคะ?' },
  { from: 'bot', text: 'สวัสดีค่ะ ☕ ร้านเปิดทุกวัน 9:00–18:00 ค่ะ' },
  { from: 'user', text: 'ลาเต้เย็นราคาเท่าไหร่คะ?' },
  { from: 'bot', text: 'ลาเต้เย็น 65 บาทค่ะ เพิ่มโอ๊ตมิลก์ +10 บาทนะคะ' },
]

export const CHAT_DEMO_CAPTION =
  'Illustrative chat demo — mock conversation, not a real customer log.'

export const CHAT_DEMO_ARIA_LABEL =
  'Illustrative animated mock chat for the LINE Chatbot RAG project: a customer asks about opening hours and menu prices, and the assistant replies in Thai. Mock conversation, not a real customer log.'
