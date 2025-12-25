import fs from 'fs';
import path from 'path';

// Import danh sách font từ lib/fonts.js
import { fonts } from '../../../lib/fonts.js';

// Đọc danh sách file font thực tế
function getActualFontFiles() {
  const fontsDir = path.join(process.cwd(), 'public', 'fonts');
  const files = fs.readdirSync(fontsDir);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.otf', '.ttf', '.woff', '.woff2'].includes(ext);
  });
}

// Đọc danh sách từ file danhsach.txt
function readFontListFromFile() {
  try {
    const danhsachPath = path.join(process.cwd(), 'public', 'fonts', 'danhsach.txt');
    if (fs.existsSync(danhsachPath)) {
      const content = fs.readFileSync(danhsachPath, 'utf8');
      return content.split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('danhsach') && !line.startsWith('helvetiker'))
        .filter(line => {
          const ext = path.extname(line).toLowerCase();
          return ['.otf', '.ttf', '.woff', '.woff2'].includes(ext);
        });
    }
  } catch (error) {
    console.error('Error reading danhsach.txt:', error);
  }
  return [];
}

// Hàm tạo mapping từ tên font sang tên file thực tế
function createFontMapping() {
  const actualFiles = getActualFontFiles();
  const danhsachFiles = readFontListFromFile();
  const mapping = {};
  
  console.log('Actual files count:', actualFiles.length);
  console.log('Danhsach files count:', danhsachFiles.length);
  
  // Mapping đặc biệt cho các font có tên file khác
  const specialMappings = {
    "KD Moon Light": "KD-Moon-Light.ttf",
    "SVN Peristiwa": "SVN-Peristiwa.otf",
    "SVN Magellin": "SVN-Magellin.otf",
    "SVN Spencerio": "SVN-Spencerio.otf",
    "SVN Diamonda": "SVN-Diamonda.otf",
    "TH Maginia": "TH Maginia.ttf",
    "MyriadPro Regular": "MyriadPro-Regular.otf",
    "SDC Sign Rathi": "SDC Sign Rathi.otf",
    "SDC The Handwritten Watermark": "SDC The Handwritten Watermark.otf",
    "SDC Evitrian": "SDC Evitrian.otf",
    "Fz Thư pháp Tiểu tự Fontzin": "Fz Thư pháp Tiểu tự Fontzin.ttf",
    "Fz Thư pháp Đại tự Fontzin": "Fz Thư pháp Đại tự Fontzin.ttf",
    "SVN Ameyallinda Signature": "SVN-Ameyallinda Signature.otf",
    "SDC Jhode": "SDC Jhode.otf",
    "SDC Betalisa": "SDC Betalisa.otf",
    "SDC House": "SDC House.otf",
    "SDC Zicets": "SDC-Zicets.otf",
    "SDC Zatyan": "SDC-Zatyan.otf",
    "SDC Zaiipt": "SDC-Zaiipt.otf",
    "SDC Youove": "SDC-Youove.otf",
    "SDC Yipes": "SDC-Yipes.otf",
    "SDC Yamasi": "SDC-Yamasi.otf",
    "SDC XXIipt": "SDC-XXIipt.otf",
    "SDC Wylgen": "SDC-Wylgen.otf",
    "SDC Wrount": "SDC-Wrount.otf",
    "SDC Wroine": "SDC-Wroine.otf",
    "SDC Wrisno": "SDC-Wrisno.otf",
    "SDC Wooker": "SDC-Wooker.otf",
    "SDC WeYuth": "SDC-WeYuth.otf",
    "SDC Wendi": "SDC-Wendi.otf",
    "SDC Welont": "SDC-Welont.otf",
    "SDC Wedday": "SDC-Wedday.otf",
    "SDC Watold": "SDC-Watold.otf",
    "SDC Watlar": "SDC-Watlar.otf",
    "SDC Walton": "SDC-Walton.otf",
    "SDC Walows": "SDC-Walows.otf",
    "SDC Walnts": "SDC-Walnts.otf",
    "SDC Vicria": "SDC-Vicria.otf",
    "SDC Verrry": "SDC-Verrry.otf",
    "SDC Verine": "SDC-Verine.otf",
    "SDC Venras": "SDC-Venras.otf",
    "SDC Veneer": "SDC-Veneer.otf",
    "SDC Velies": "SDC-Velies.otf",
    "SDC Vantom": "SDC-Vantom.otf",
    "SDC VanPro": "SDC-VanPro.otf",
    "SDC Vanlla": "SDC-Vanlla.otf",
    "SDC Vamres": "SDC-Vamres.otf",
    "SDC Vala": "SDC-Vala.otf",
    "iCiel Alina": "iCiel Alina.otf",
    "iCiel Altus Serif": "iCiel Altus Serif.otf",
    "iCiel Altus": "iCiel Altus Extra.otf",
    "iciel Cadena": "iciel Cadena.ttf",
    "iCiel Crocante": "iCiel Crocante.otf",
    "iCiel Finch bold": "iCiel Finch bold.otf",
    "iCiel Finch": "iCiel Finch bold.otf",
    "iCiel Kermel": "iCiel Kermel.otf",
    "iCiel Pacifico": "iCiel Pacifico.otf",
    "iCiel Rukola": "iCiel Rukola.otf",
    "iCiel TALUHLA": "iCiel TALUHLA.otf",
    "iCielAmerigraf": "iCielAmerigraf.otf",
    "iCielBambola": "iCielBambola.otf",
    "iCielCadena": "iciel Cadena.ttf",
    "iCielParisSerif Bold": "iCielParisSerif-Bold.otf",
    "iCielSoupofJustice": "iCielSoupofJustice.otf",
    "Cucho": "Cucho Bold.otf",
    "Cucho Bold": "Cucho Bold.otf",
    "BreeSerif": "BreeSerif.otf",
    "Gotham Medium": "Gotham-Medium.otf",
    "Gotham Thin": "Gotham-Thin.otf",
    "Gotham Ultra": "Gotham-Ultra.otf",
    "HP DNS Gibsons One Bold": "HP DNS Gibsons One Bold.otf",
    "HP DNS Gibsons One Outline": "HP DNS Gibsons One Outline.ttf",
    "HP DNS Gibsons One Semi Bold": "HP DNS Gibsons One Semi Bold.otf",
    "HP DNS Gibsons One": "HP DNS Gibsons One.otf",
    "HP Monstice Base": "HP Monstice Base.otf",
    "HP Monstice Emboss": "HP Monstice Emboss.otf",
    "HP Monstice Engraved": "HP Monstice Engraved.otf",
    "HP Monstice Inline": "HP Monstice Inline.otf",
    "Mijas Ultra": "Mijas-Ultra.otf"
  };

  // Thêm các mapping đặc biệt
  Object.assign(mapping, specialMappings);

  // Tạo mapping cho các font MTD từ danhsach.txt
  danhsachFiles.forEach(fileName => {
    if (fileName.startsWith('MTD ')) {
      const fontName = fileName.replace('.otf', '').replace('.ttf', '');
      mapping[fontName] = fileName;
    }
  });

  // Tạo mapping cho các font SDC từ danhsach.txt
  danhsachFiles.forEach(fileName => {
    if (fileName.startsWith('SDC ')) {
      const fontName = fileName.replace('.otf', '').replace('.ttf', '');
      mapping[fontName] = fileName;
    }
  });

  // Tạo mapping cho các font SVN từ danhsach.txt
  danhsachFiles.forEach(fileName => {
    if (fileName.startsWith('SVN ')) {
      const fontName = fileName.replace('.otf', '').replace('.ttf', '');
      mapping[fontName] = fileName;
    }
  });

  // Tạo mapping cho các font UTM từ danhsach.txt
  danhsachFiles.forEach(fileName => {
    if (fileName.startsWith('UTM ')) {
      const fontName = fileName.replace('.otf', '').replace('.ttf', '');
      mapping[fontName] = fileName;
    }
  });

  // Tạo mapping cho các font UVN từ danhsach.txt
  danhsachFiles.forEach(fileName => {
    if (fileName.startsWith('UVN')) {
      const fontName = fileName.replace('.otf', '').replace('.ttf', '');
      mapping[fontName] = fileName;
    }
  });

  // Tạo mapping cho các font iCiel từ danhsach.txt
  danhsachFiles.forEach(fileName => {
    if (fileName.startsWith('iCiel')) {
      const fontName = fileName.replace('.otf', '').replace('.ttf', '');
      mapping[fontName] = fileName;
    }
  });

  // Tạo mapping cho các font HP từ danhsach.txt
  danhsachFiles.forEach(fileName => {
    if (fileName.startsWith('HP ')) {
      const fontName = fileName.replace('.otf', '').replace('.ttf', '');
      mapping[fontName] = fileName;
    }
  });

  // Tạo mapping cho các font khác từ danhsach.txt
  danhsachFiles.forEach(fileName => {
    if (!fileName.startsWith('MTD ') && !fileName.startsWith('SDC ') && 
        !fileName.startsWith('SVN ') && !fileName.startsWith('UTM ') && 
        !fileName.startsWith('UVN') && !fileName.startsWith('iCiel') && 
        !fileName.startsWith('HP ')) {
      const fontName = fileName.replace('.otf', '').replace('.ttf', '');
      mapping[fontName] = fileName;
    }
  });

  console.log('Total mappings created:', Object.keys(mapping).length);
  return mapping;
}

// Tạo fontFileMap
const fontFileMap = createFontMapping();

export default async function handler(req, res) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Tạm thời bỏ qua authentication để test
    // TODO: Thêm lại authentication sau khi fix lỗi
    
    const { deviceId, font } = req.body;

    if (!deviceId || !font) {
      return res.status(400).json({ error: 'Missing deviceId or font parameter' });
    }

    // Validate font name
    if (typeof font !== 'string' || font.length > 100) {
      return res.status(400).json({ error: 'Invalid font name' });
    }

    // Debug logging
    console.log('Requested font:', font);
    console.log('Available fonts in map:', Object.keys(fontFileMap).length);
    
    // Lấy tên file font từ fontFileMap
    const fontFileName = fontFileMap[font];
    
    console.log('Found font file:', fontFileName);
    
    if (!fontFileName) {
      return res.status(404).json({ 
        error: 'Font not found', 
        requestedFont: font,
        availableFonts: Object.keys(fontFileMap).slice(0, 10), // Trả về 10 font đầu tiên để debug
        totalAvailableFonts: Object.keys(fontFileMap).length
      });
    }

    // Đường dẫn đến file font
    const fontPath = path.join(process.cwd(), 'public', 'fonts', fontFileName);
    
    console.log('Font path:', fontPath);
    console.log('File exists:', fs.existsSync(fontPath));

    // Kiểm tra file có tồn tại không
    if (!fs.existsSync(fontPath)) {
      // Thử tìm file với các extension khác nhau
      const extensions = ['.otf', '.ttf', '.woff', '.woff2'];
      let foundFile = null;
      
      for (const ext of extensions) {
        const testPath = path.join(process.cwd(), 'public', 'fonts', fontFileName.replace(/\.[^/.]+$/, '') + ext);
        if (fs.existsSync(testPath)) {
          foundFile = testPath;
          break;
        }
      }
      
      if (foundFile) {
        console.log('Found font file with different extension:', foundFile);
        const fontBuffer = fs.readFileSync(foundFile);
        const ext = path.extname(foundFile).toLowerCase();
        let contentType = 'application/octet-stream';
        
        if (ext === '.ttf') {
          contentType = 'font/ttf';
        } else if (ext === '.otf') {
          contentType = 'font/otf';
        } else if (ext === '.woff') {
          contentType = 'font/woff';
        } else if (ext === '.woff2') {
          contentType = 'font/woff2';
        }

        res.setHeader('Content-Type', contentType);
        const encodedFileName = encodeURIComponent(path.basename(foundFile));
        res.setHeader('Content-Disposition', `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`);
        res.setHeader('Content-Length', fontBuffer.length);
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        console.log(`Font download: ${font} by user (temporary bypass auth)`);
        return res.send(fontBuffer);
      }
      
      return res.status(404).json({ 
        error: 'Font file not found', 
        path: fontPath,
        generatedFileName: fontFileName,
        requestedFont: font,
        availableFiles: getActualFontFiles().slice(0, 10) // Trả về 10 file đầu tiên để debug
      });
    }

    // Đọc file font
    console.log('Reading font file...');
    const fontBuffer = fs.readFileSync(fontPath);
    console.log('Font buffer size:', fontBuffer.length);

    // Xác định content type dựa trên extension
    const ext = path.extname(fontFileName).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.ttf') {
      contentType = 'font/ttf';
    } else if (ext === '.otf') {
      contentType = 'font/otf';
    } else if (ext === '.woff') {
      contentType = 'font/woff';
    } else if (ext === '.woff2') {
      contentType = 'font/woff2';
    }

    // Set headers cho download
    res.setHeader('Content-Type', contentType);
    // Encode filename để tránh lỗi ký tự đặc biệt
    const encodedFileName = encodeURIComponent(fontFileName);
    res.setHeader('Content-Disposition', `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`);
    res.setHeader('Content-Length', fontBuffer.length);
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Log việc download font
    console.log(`Font download: ${font} by user (temporary bypass auth)`);

    // Gửi file
    res.send(fontBuffer);

  } catch (error) {
    console.error('Error downloading font:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message,
      stack: error.stack 
    });
  }
} 