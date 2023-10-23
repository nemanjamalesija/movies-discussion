export default function focusInput(inputId: string) {
  const input = document.querySelector(inputId) as HTMLInputElement
  setTimeout(() => {
    input.focus()
  }, 10)
}
