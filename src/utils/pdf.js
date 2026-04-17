import jsPDF from 'jspdf'

export function generatePDF(tripData, plan, itinerary) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = 210
  const margin = 16
  const contentW = pageW - margin * 2
  let y = margin

  const lineH = 6
  const addLine = (amount = lineH) => { y += amount }

  // ── Header ─────────────────────────────────────────────────
  doc.setFillColor(234, 88, 12)
  doc.roundedRect(margin, y, contentW, 30, 4, 4, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Shawaf | شواف', margin + 8, y + 12)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('AI-Powered Travel Plan', margin + 8, y + 21)
  y += 36

  // ── Trip Summary ───────────────────────────────────────────
  doc.setTextColor(28, 25, 23)
  doc.setFillColor(255, 247, 237)
  doc.roundedRect(margin, y, contentW, 24, 3, 3, 'F')
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(180, 65, 12)
  doc.text('Trip Summary', margin + 4, y + 7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(68, 64, 60)
  doc.text(`Destination: ${tripData.city || ''}`, margin + 4, y + 14)
  if (tripData.startDate) doc.text(`Dates: ${tripData.startDate} → ${tripData.endDate || ''}`, margin + 70, y + 14)
  if (tripData.numberOfPeople) doc.text(`People: ${tripData.numberOfPeople}`, margin + 145, y + 14)
  y += 30

  // ── Itinerary days ─────────────────────────────────────────
  const days = itinerary || plan?.itinerary || plan?.days || []

  days.forEach((day, di) => {
    // Day header
    if (y > 265) { doc.addPage(); y = margin }
    doc.setFillColor(234, 88, 12)
    doc.roundedRect(margin, y, contentW, 9, 2, 2, 'F')
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text(`Day ${di + 1}${day.theme ? '  —  ' + day.theme : ''}`, margin + 4, y + 6.2)
    y += 13

    const stations = day.stations || day.activities || []
    stations.forEach((station, si) => {
      if (y > 265) { doc.addPage(); y = margin }
      const name = station.name || station.place || station.title || ''
      const time = station.time || ''
      const desc = station.description || ''

      // Station row
      doc.setFillColor(249, 250, 251)
      doc.roundedRect(margin, y, contentW, 5, 1, 1, 'F')
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(28, 25, 23)
      doc.text(`${si + 1}. ${name}`, margin + 4, y + 3.8)
      if (time) {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(234, 88, 12)
        doc.text(time, margin + contentW - 4, y + 3.8, { align: 'right' })
      }
      y += 6

      if (desc) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(120, 113, 108)
        const lines = doc.splitTextToSize(desc, contentW - 12)
        if (y + lines.length * 4 > 270) { doc.addPage(); y = margin }
        doc.text(lines, margin + 8, y + 3)
        y += lines.length * 4 + 2
      }
      y += 2
    })
    y += 4
  })

  // ── Footer ─────────────────────────────────────────────────
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(168, 162, 158)
    doc.text(
      `Shawaf — شواف  |  AI Travel Planner  |  Aligned with Vision 2030  |  Page ${i} of ${pageCount}`,
      pageW / 2, 292, { align: 'center' }
    )
  }

  doc.save(`Shawaf-${tripData.city || 'trip'}-itinerary.pdf`)
}
