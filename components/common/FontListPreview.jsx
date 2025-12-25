export default function FontListPreview({
  fonts,
  brideGroomName,
  dark = true,
  rowsPerCol = 10,
  fontSize = 20,
}) {
  if (!fonts || fonts.length === 0) return null;

  const numCols = Math.ceil(fonts.length / rowsPerCol);
  const colsData = Array.from({ length: numCols }, (_, colIdx) =>
    fonts.slice(colIdx * rowsPerCol, (colIdx + 1) * rowsPerCol)
  );
  const textToShow = brideGroomName || "Tên Cô Dâu & Chú Rể";

  // Tính toán kích thước chữ động dựa trên độ dài text và đặc tính font
  const calculateFontSize = (text, fontName) => {
    const baseSize = 18; // Giảm base size để có nhiều không gian hơn
    const maxWidth = 280; // Chiều rộng tối đa cho text
    const fontNameWidth = 120; // Chiều rộng dành cho tên font
    const availableWidth = maxWidth - fontNameWidth - 20; // Trừ đi padding và margin
    
    // Ước tính độ dài text (tiếng Việt có thể dài hơn)
    const textLength = text.length;
    let calculatedSize = baseSize;
    
    // Giảm kích thước nếu text quá dài
    if (textLength > 15) {
      calculatedSize = Math.max(12, baseSize - (textLength - 15) * 0.6);
    }
    
    // Điều chỉnh kích thước dựa trên loại font (script fonts thường cần nhỏ hơn)
    const scriptFonts = ['Fz Thư pháp', 'iCiel Amerigraf', 'iCielBambola'];
    const isScriptFont = scriptFonts.some(scriptFont => fontName.includes(scriptFont));
    
    if (isScriptFont) {
      calculatedSize = Math.max(10, calculatedSize * 0.8);
    }
    
    // Đảm bảo kích thước tối thiểu và tối đa
    return Math.max(10, Math.min(baseSize, calculatedSize));
  };

  return (
         <div
       style={{
         width: Math.max(450 * numCols, 600),
         minHeight: 120 + rowsPerCol * 40, // Tăng minHeight để chứa text dài
         padding: 5,
         background: dark ? "#24272b" : "#fff",
         color: dark ? "#fff" : "#000",
         fontFamily: "sans-serif",
         position: "relative",
         boxSizing: "border-box",
       }}
     >
      <div style={{ fontWeight: 500, fontSize: 30, marginBottom: 18, marginLeft: 10 }}>
        Bộ font text: {textToShow}
      </div>

      <div
        style={{
          display: "flex",
          gap: 18,
          paddingBottom: 64,
          overflowX: "auto",
        }}
      >
        {colsData.map((col, colIdx) => (
          <div key={colIdx} style={{ minWidth: 340 }}>
            {col.map((font, rowIdx) => {
              const globalIdx = colIdx * rowsPerCol + rowIdx;
              const dynamicFontSize = calculateFontSize(textToShow, font);
              
              return (
                  <div
                   key={font}
                   style={{
                     display: "flex",
                     alignItems: "flex-start",
                     minHeight: dynamicFontSize + 16,
                     marginBottom: 4,
                     paddingTop: 2,
                     position: "relative", // Thêm position relative
                   }}
                 >
                   <span
                     style={{
                       fontSize: 20,
                       width: 36,
                       color: "#bbb",
                       fontWeight: 500,
                       flexShrink: 0,
                       textAlign: "right",
                       marginRight: 10,
                       paddingTop: 2, // Thêm padding top để căn chỉnh với text
                     }}
                   >
                     {globalIdx + 1}.
                   </span>
                   <div
                     style={{
                       display: "flex",
                       alignItems: "flex-start",
                       justifyContent: "space-between",
                       width: "100%",
                       gap: 12,
                       minHeight: dynamicFontSize + 12,
                       position: "relative", // Thêm position relative để căn chỉnh tốt hơn
                     }}
                   >
                                          <span
                       style={{
                         fontFamily: `"${font}", Arial, sans-serif`,
                         fontSize: dynamicFontSize,
                         color: dark ? "#fff" : "#000",
                         lineHeight: 1.4,
                         textShadow: dark ? "0 1px 1px #0006" : "none",
                         whiteSpace: "normal",
                         maxWidth: 180,
                         borderBottom: "1px dashed #444",
                         paddingBottom: 3,
                         paddingTop: 2,
                         flex: 1,
                         wordWrap: "break-word",
                         overflowWrap: "break-word",
                         minWidth: 0,
                         display: "block", // Thay đổi từ flex sang block để căn chỉnh tốt hơn
                         verticalAlign: "top", // Đảm bảo căn đầu
                       }}
                       title={textToShow}
                     >
                       {textToShow}
                     </span>
                     <span
                       style={{
                         color: "#aaa",
                         fontSize: 11,
                         fontStyle: "italic",
                         flexShrink: 0,
                         whiteSpace: "nowrap",
                         minWidth: 90,
                         textAlign: "right",
                         paddingLeft: 8,
                         alignSelf: "flex-start",
                         marginTop: 2,
                         paddingTop: 2, // Thêm padding top để căn chỉnh với text
                       }}
                     >
                       ({font})
                     </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div
        style={{
          width: "100%",
          textAlign: "left",
          fontSize: 17,
          color: "#ccc",
          position: "absolute",
          left: 32,
          bottom: 14,
        }}
      >
        Sưu tầm bởi Cưới Hỏi Kinh Bắc | font.cuohoibacgiang.com
      </div>
    </div>
  );
}
