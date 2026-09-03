/**
 * Visionix Education Profile Display Formatters
 * Converts raw internal education identifiers into clean, user-friendly, human-readable labels.
 */

export function formatEducationLevel(level?: string): string {
  if (!level) return 'Current Education Stage';
  const l = level.toLowerCase().trim();

  if (l.includes('school') || l.includes('10th') || l.includes('class_10') || l.includes('secondary')) {
    return 'Class 10 (Secondary School)';
  }
  if (l.includes('intermediate') || l.includes('10+2') || l.includes('12th') || l.includes('puc') || l.includes('junior college')) {
    return 'Intermediate (10+2 / Junior College)';
  }
  if (l.includes('diploma') || l.includes('polytechnic')) {
    return 'Polytechnic Diploma';
  }
  if (l.includes('undergraduate') || l.includes('bachelor') || l.includes('btech') || l.includes('bca') || l.includes('bcom') || l.includes('bba') || l.includes('mbbs')) {
    return 'Undergraduate Degree';
  }
  if (l.includes('postgraduate') || l.includes('master')) {
    return 'Postgraduate Degree';
  }

  // Fallback: title case
  return level.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function formatCurrentClass(currentClass?: string, studyYear?: string): string {
  const c = (currentClass || '').toLowerCase().trim();
  const y = (studyYear || '').toLowerCase().trim();

  if (c === 'class_12_2nd_year' || (c.includes('12') && y.includes('2nd'))) {
    return 'Class 12 • 2nd Year';
  }
  if (c === 'class_11_1st_year' || (c.includes('11') && y.includes('1st'))) {
    return 'Class 11 • 1st Year';
  }
  if (c === 'class_10' || c === '10th') {
    return 'Class 10 (10th Standard)';
  }
  if (c === 'class_9' || c === '9th') {
    return 'Class 9';
  }
  if (c.includes('class') || c.includes('standard')) {
    return c.replace(/[_-]/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase());
  }

  if (y) {
    if (y.includes('1st') || y.includes('first') || y === '1') return '1st Year';
    if (y.includes('2nd') || y.includes('second') || y === '2') return '2nd Year';
    if (y.includes('3rd') || y.includes('third') || y === '3') return '3rd Year';
    if (y.includes('4th') || y.includes('fourth') || y === '4') return '4th Year';
    if (y.includes('final') || y.includes('graduated')) return 'Final Year';
    return y.replace(/[_-]/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase());
  }

  if (c) {
    return c.replace(/[_-]/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase());
  }

  return '';
}

export function formatStream(stream?: string, specialization?: string): string {
  if (!stream && !specialization) return 'General Studies';
  const s = (stream || '').toLowerCase().trim();
  const sp = (specialization || '').toLowerCase().trim();

  if (s === 'mpc' || s.includes('mpc')) return 'MPC (Maths, Physics, Chemistry)';
  if (s === 'bipc' || s.includes('bipc')) return 'BiPC (Biology, Physics, Chemistry)';
  if (s === 'pcmb' || s.includes('pcmb')) return 'PCMB (Physics, Chemistry, Maths, Biology)';
  if (s === 'mec' || s.includes('mec')) return 'MEC (Maths, Economics, Commerce)';
  if (s === 'cec' || s.includes('cec')) return 'CEC (Civics, Economics, Commerce)';
  if (s === 'hec' || s.includes('hec')) return 'HEC (History, Economics, Civics)';

  if (s.includes('dip_cse') || (s.includes('diploma') && (s.includes('cse') || sp.includes('cse') || sp.includes('computer')))) {
    return 'Diploma in Computer Engineering (CSE)';
  }
  if (s.includes('dip_mech') || (s.includes('diploma') && (s.includes('mech') || sp.includes('mech')))) {
    return 'Diploma in Mechanical Engineering';
  }
  if (s.includes('dip_civil') || (s.includes('diploma') && (s.includes('civil') || sp.includes('civil')))) {
    return 'Diploma in Civil Engineering';
  }
  if (s.includes('dip_eee') || s.includes('dip_ece') || (s.includes('diploma') && (s.includes('elec') || sp.includes('elec')))) {
    return 'Diploma in Electrical / Electronics Engineering';
  }

  if (s.includes('btech') || s.includes('b.tech') || s.includes('b.e.') || s.includes('engineering')) {
    if (sp.includes('cse') || sp.includes('computer') || s.includes('cse')) {
      return 'B.Tech — Computer Science & Engineering';
    }
    if (sp.includes('mech') || s.includes('mech')) return 'B.Tech — Mechanical Engineering';
    if (sp.includes('civil') || s.includes('civil')) return 'B.Tech — Civil Engineering';
    if (sp.includes('ai') || sp.includes('data')) return 'B.Tech — AI & Data Science';
    return specialization ? `B.Tech — ${specialization}` : 'B.Tech / B.E. (Engineering)';
  }

  if (s.includes('bca')) return specialization ? `BCA — ${specialization}` : 'BCA (Computer Applications)';
  if (s.includes('bcom') || s.includes('b.com') || s.includes('commerce')) return specialization ? `B.Com — ${specialization}` : 'B.Com (Commerce & Finance)';
  if (s.includes('bba')) return specialization ? `BBA — ${specialization}` : 'BBA (Business Administration)';
  if (s.includes('mbbs')) return 'MBBS (Medicine & Surgery)';

  return stream ? stream.replace(/[_-]/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase()) : 'General Studies';
}
