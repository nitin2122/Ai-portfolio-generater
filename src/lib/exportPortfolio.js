/**
 * exportPortfolio.js — Generates a fully self-contained HTML portfolio file
 * and triggers a browser download. This approach is 100% reliable vs html2canvas
 * because it doesn't require DOM capture, CORS-safe images, or overflow tricks.
 *
 * For PNG/JPEG: opens the HTML in a new window and uses the browser's built-in
 * print/screenshot. For PDF: uses the browser's native print dialog.
 */

export function buildPortfolioHTML(themeData, userData, variant = 1) {
  const {
    bg = '#0a0a0b',
    text = '#f5f5f5',
    accent = '#ccff00',
    fontDisplay = 'Space Grotesk',
    fontBody = 'Inter',
    bio = '',
    aboutText = '',
    skills = [],
    experience = [],
  } = themeData;

  const name = userData?.name || 'Portfolio';
  const role = userData?.role || 'Creative Director';
  const firstName = name.split(' ')[0];
  const lastName = name.split(' ').slice(1).join(' ');

  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontDisplay.replace(/\s+/g, '+')}:wght@400;700;900&family=${fontBody.replace(/\s+/g, '+')}:wght@300;400;700;800&display=swap`;

  const skillsHTML = skills.map(s =>
    `<span style="padding:6px 16px;border-radius:100px;border:1px solid ${text}30;font-size:11px;font-weight:700;color:${text};letter-spacing:1px;text-transform:uppercase;">${s}</span>`
  ).join('');

  const experienceV1HTML = experience.map((exp, i) => `
    <div style="display:flex;justify-content:space-between;align-items:flex-end;padding:36px 0;border-bottom:1px solid ${text}12;flex-wrap:wrap;gap:12px;">
      <div>
        <div style="font-size:9px;font-weight:900;color:${accent};letter-spacing:3px;margin-bottom:12px;">0${i+1} // ${exp.duration || ''}</div>
        <div style="font-family:'${fontDisplay}',serif;font-size:clamp(22px,4vw,52px);font-weight:700;letter-spacing:-0.03em;line-height:1;color:${text};">${(exp.role || 'Expert').toUpperCase()}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:16px;font-weight:800;color:${accent};margin-bottom:6px;">${exp.company || ''}</div>
        <div style="font-size:9px;font-weight:800;letter-spacing:3px;color:${text};opacity:0.3;text-transform:uppercase;">View →</div>
      </div>
    </div>
    <p style="font-size:14px;line-height:1.7;color:${text};opacity:0.55;padding:16px 0 24px;">${exp.description || ''}</p>
  `).join('');

  const experienceV2HTML = experience.map((exp, i) => `
    <div style="border-bottom:1px solid ${text}10;padding:28px;border-radius:12px;margin-bottom:8px;">
      <div style="font-size:9px;font-weight:900;color:${text};opacity:0.25;letter-spacing:3px;margin-bottom:8px;text-transform:uppercase;">${exp.duration}</div>
      <div style="font-family:'${fontDisplay}',serif;font-size:clamp(20px,3vw,32px);font-weight:700;margin-bottom:10px;color:${text};">${exp.company || ''}</div>
      <div style="color:${accent};font-weight:800;font-size:12px;margin-bottom:16px;letter-spacing:1px;">${(exp.role || '').toUpperCase()}</div>
      <p style="opacity:0.5;font-size:13px;line-height:1.6;color:${text};">${exp.description || ''}</p>
    </div>
  `).join('');

  const experienceV3HTML = experience.map((exp, i) => `
    <div style="margin-bottom:60px;">
      <div style="aspect-ratio:16/9;background:${accent}12;margin-bottom:24px;border-radius:8px;position:relative;border:1px solid ${text}08;overflow:hidden;">
        <div style="position:absolute;inset:0;background:linear-gradient(135deg,${accent}15,transparent);"></div>
        <div style="position:absolute;bottom:24px;left:24px;">
          <div style="font-size:9px;font-weight:900;color:${accent};letter-spacing:2px;margin-bottom:6px;">PROJECT // 0${i+1}</div>
          <div style="font-family:'${fontDisplay}',serif;font-size:clamp(16px,3vw,24px);font-weight:700;color:${text};">${exp.company || ''}</div>
        </div>
      </div>
      <div style="font-size:12px;font-weight:700;color:${accent};letter-spacing:1px;margin-bottom:4px;">${(exp.role||'').toUpperCase()}</div>
      <p style="font-size:13px;line-height:1.6;color:${text};opacity:0.55;">${exp.description||''}</p>
    </div>
  `).join('');

  let bodyContent = '';

  if (variant === 1) {
    bodyContent = `
      <nav style="display:flex;justify-content:space-between;align-items:center;margin-bottom:clamp(60px,10vw,120px);flex-wrap:wrap;gap:16px;">
        <div style="font-family:'${fontDisplay}',serif;font-size:clamp(20px,4vw,28px);font-weight:900;letter-spacing:-0.02em;color:${text};">${firstName}<span style="color:${accent};">.</span></div>
        <div style="display:flex;gap:32px;font-size:10px;font-weight:800;letter-spacing:2px;color:${text};flex-wrap:wrap;">
          <span style="opacity:0.6;">PROJECTS</span><span style="opacity:0.6;">STUDIO</span><span style="opacity:0.6;">JOURNAL</span>
        </div>
      </nav>
      <div style="max-width:900px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
          <div style="width:40px;height:1px;background:${accent};"></div>
          <span style="font-size:9px;font-weight:900;letter-spacing:5px;color:${accent};text-transform:uppercase;">${role}</span>
        </div>
        <h1 style="font-family:'${fontDisplay}',serif;font-size:clamp(36px,8vw,110px);line-height:0.88;margin-bottom:48px;font-weight:900;letter-spacing:-0.05em;color:${text};">
          ${bio ? bio.split(' ').slice(0,3).join(' ').toUpperCase() : firstName.toUpperCase()}<br>
          <span style="color:${accent};">${bio ? bio.split(' ').slice(3,6).join(' ').toUpperCase()+'.' : 'PORTFOLIO.'}</span>
        </h1>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:clamp(32px,6vw,80px);margin-bottom:clamp(60px,10vw,140px);">
          <p style="font-size:clamp(14px,2vw,18px);line-height:1.6;color:${text};opacity:0.65;">${bio || `${name} is a creative professional specializing in ${role}.`}</p>
          <div>
            <div style="font-size:9px;font-weight:900;letter-spacing:4px;color:${accent};margin-bottom:16px;text-transform:uppercase;">Core Expertise</div>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">${skillsHTML}</div>
          </div>
        </div>
        ${experienceV1HTML}
      </div>`;
  } else if (variant === 2) {
    bodyContent = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));min-height:100vh;gap:0;">
        <div style="padding:clamp(32px,5vw,80px) clamp(20px,4vw,60px);border-right:1px solid ${text}10;display:flex;flex-direction:column;justify-content:space-between;gap:40px;">
          <div style="font-family:'${fontDisplay}',serif;font-size:clamp(20px,4vw,28px);font-weight:900;color:${text};">${firstName}</div>
          <div>
            <div style="font-size:9px;font-weight:900;letter-spacing:5px;color:${accent};text-transform:uppercase;margin-bottom:16px;">${role}</div>
            <h1 style="font-family:'${fontDisplay}',serif;font-size:clamp(32px,5vw,64px);line-height:1;font-weight:900;letter-spacing:-0.04em;margin-bottom:24px;color:${text};">
              ${aboutText ? aboutText.split(' ').slice(0,2).join(' ').toUpperCase() : 'CRAFTING'}<br>
              ${aboutText ? aboutText.split(' ').slice(2,4).join(' ').toUpperCase() : 'DIGITAL'}<br>
              <span style="color:${accent};">${aboutText ? aboutText.split(' ').slice(4,6).join(' ').toUpperCase()+'.' : 'POETRY.'}</span>
            </h1>
            <p style="font-size:15px;opacity:0.55;max-width:380px;line-height:1.6;color:${text};">${bio}</p>
          </div>
          <div style="display:flex;gap:16px;flex-wrap:wrap;">${skills.slice(0,3).map(s=>`<span style="font-size:9px;font-weight:900;letter-spacing:3px;color:${accent};text-transform:uppercase;">${s}</span>`).join('')}</div>
        </div>
        <div style="padding:clamp(32px,5vw,80px) clamp(20px,4vw,60px);">${experienceV2HTML}</div>
      </div>`;
  } else {
    bodyContent = `
      <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:clamp(60px,8vw,120px) clamp(20px,5vw,60px);">
        <div style="color:${accent};font-size:10px;font-weight:900;letter-spacing:8px;margin-bottom:28px;">${role.toUpperCase()}</div>
        <h1 style="font-family:'${fontDisplay}',serif;font-size:clamp(48px,10vw,140px);line-height:0.82;font-weight:900;letter-spacing:-0.07em;color:${text};">
          ${firstName}<br>${lastName}
        </h1>
        <div style="width:80px;height:1px;background:${text};margin:48px auto;opacity:0.12;"></div>
        <p style="max-width:520px;font-size:clamp(13px,2vw,16px);opacity:0.45;line-height:1.6;color:${text};">${bio}</p>
      </div>
      <div style="padding:clamp(60px,8vw,120px) clamp(20px,5vw,60px);">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:32px;">${experienceV3HTML}</div>
      </div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${name} — Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link rel="stylesheet" href="${fontUrl}"/>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    body{background:${bg};color:${text};font-family:'${fontBody}',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased;}
    ::selection{background:${accent};color:#000;}
    @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
  </style>
</head>
<body>
  <div style="padding:clamp(32px,6vw,80px) clamp(20px,5vw,60px);max-width:1400px;margin:0 auto;">
    ${bodyContent}
    <footer style="margin-top:80px;padding-top:32px;border-top:1px solid ${text}10;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
      <div style="font-family:'${fontDisplay}',serif;font-size:20px;font-weight:900;color:${accent};letter-spacing:3px;">AIPF<span style="color:${text};">.</span></div>
      <div style="font-size:11px;color:${text};opacity:0.3;">Generated by AIPF Kinetic Noir Engine · ${new Date().getFullYear()}</div>
    </footer>
  </div>
</body>
</html>`;
}

/**
 * downloadAsHTML — three-tier fallback download.
 * Blob URL works for <a download> even under strict CSP (CSP only blocks navigation TO blob, not downloads).
 */
export function downloadAsHTML(themeData, userData, variant) {
  const html = buildPortfolioHTML(themeData, userData, variant);
  const safeName = (userData?.name || 'Portfolio').replace(/\s+/g, '_');
  const fileName = `${safeName}_Portfolio_V${variant}.html`;

  // Tier 1: Blob URL (most reliable, works everywhere for downloads)
  try {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    return true;
  } catch (_) {}

  // Tier 2: data URI (no special chars risk since we encode properly)
  try {
    const encoded = encodeURIComponent(html);
    const a = document.createElement('a');
    a.href = `data:text/html;charset=utf-8,${encoded}`;
    a.download = fileName;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  } catch (_) {}

  // Tier 3: open in new tab — user can Ctrl+S / Save As
  const w = window.open('', '_blank');
  if (w) { w.document.write(html); w.document.close(); w.document.title = fileName; }
  return !!w;



/**
 * printAsPDF — injects a hidden iframe, writes the portfolio HTML into it,
 * then calls print() on it. This bypasses popup blockers AND Vercel CSP headers
 * that kill window.open(). The iframe lives inside the same page context.
 */
export function printAsPDF(themeData, userData, variant) {
  const html = buildPortfolioHTML(themeData, userData, variant);

  // Remove any previous print iframe
  const old = document.getElementById('__aipf_print_frame__');
  if (old) old.remove();

  const iframe = document.createElement('iframe');
  iframe.id = '__aipf_print_frame__';
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;visibility:hidden;';
  document.body.appendChild(iframe);

  try {
    // Write HTML into the iframe document
    iframe.contentDocument.open();
    iframe.contentDocument.write(html);
    iframe.contentDocument.close();

    // Wait for fonts/layout to settle, then trigger print dialog
    const doPrint = () => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (e) {
        // Last-resort: data URI in new tab if iframe print fails
        try {
          const b64 = btoa(unescape(encodeURIComponent(html)));
          window.open(`data:text/html;base64,${b64}`, '_blank');
        } catch (_) {}
      }
      // Clean up after print dialog closes (delay to allow print to start)
      setTimeout(() => iframe.remove(), 5000);
    };

    if (iframe.contentDocument.readyState === 'complete') {
      setTimeout(doPrint, 400);
    } else {
      iframe.contentWindow.onload = () => setTimeout(doPrint, 400);
    }
    return true;
  } catch (e) {
    iframe.remove();
    // Fallback to data URI tab
    try {
      const b64 = btoa(unescape(encodeURIComponent(html)));
      const opened = window.open(`data:text/html;base64,${b64}`, '_blank');
      return !!opened;
    } catch (_) {
      return false;
    }
  }
}

