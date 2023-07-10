export default function isMouseOverElementRect(
  elementRect: DOMRect,
  mouseX: number,
  mouseY: number
) {
  const elementX = elementRect.left;
  const elementY = elementRect.top;
  const elementWidth = elementRect.width;
  const elementHeight = elementRect.height;

  return (
    mouseX >= elementX &&
    mouseX <= elementX + elementWidth &&
    mouseY >= elementY &&
    mouseY <= elementY + elementHeight
  );
}
