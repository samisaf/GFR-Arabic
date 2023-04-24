import './app.css'
import { useState } from 'preact/hooks'
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

// Create rtl cache
const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin], });

let t1 = 'معادلة';
let t2 = ' CKD-EPI ';
let t3 = 'لتقدير الرشح الكبيبي الكلوي';
let title = `${t1} ${t2} ${t3}`;
let outputMessage = "أدخل بيانات المريض"
let description = [
  'هذه الصفحة تستخدم المعادلة لعام ٢٠٢١',
  'تعتبر هذه المعادلة المعيار الموصى به الان',
  'لا يتضمن الحساب بهذا الإصدار عرق المريض بخلاف معادلي الكرياتينين لعامي ٢٠٠٩ و٢٠١٢',
  'ينصح باستخدام هذه المعادلة للمرضى ذوي وظائف الكلى المستقرة',
];

let aboutMessage = "هذا البرنامج من إعداد الدكتور سامي صفدي. يمكن مراسلتنا بالنقر على هذا "

function calcGFR(Scr, Age, Gender) {
  let A = (Gender == "Female") ? 0.7 : 0.9;
  let B = null;
  if (Gender == "Female" && Scr <= 0.7) B = -0.241;
  else if (Gender == "Female" && Scr > 0.7) B = -1.2;
  else if (Gender == "Male" && Scr <= 0.9) B = -0.302;
  else if (Gender == "Male" && Scr > 0.9) B = -1.2;
  let term1 = 142 * (Scr / A) ** B;
  let term2 = 0.9938 ** Age;
  let term3 = Gender == "Male" ? 1 : 1.012;
  return term1 * term2 * term3
}

export function App() {
  const [Scr, setScr] = useState()
  const [Age, setAge] = useState()
  const [Gender, setGender] = useState()

  let GFR = Math.round(calcGFR(Scr, Age, Gender))
  let output1 = "معدل الرشح الكبيبي الكلوي"
  let output2 = " (ميلي ليتر | دقيقة | ١.٧٣ متر مربع)"
  let output3 = `${output1} ${GFR} ${output2}`
  let output = (Scr > 0) && (Age > 0) && (GFR > 0) && Gender && output3

  return (
    <CacheProvider value={cacheRtl}>
      <h1>{title}</h1>
      {/* Information Section */}
      <p>
        <Alert severity="warning">
          {description.map((i) => (
            <p>{i}</p>
          ))}
        </Alert>
      </p>

      {/* Data Entry Section */}
      <p>
        <Alert severity="info">
          <TextField
            error={Scr <= 0 ? true : false}
            id="serum-creatinine"
            label="تركيز الكرياتينين (مغ|دسل)"
            type="number"
            value={Scr}
            placeholder=''
            onInput={e => setScr(e.target.value)}
            variant="standard"
            fullWidth
          />
          <TextField
            error={Age <= 0 ? true : false}
            id="age"
            label="العمر (سنة)"
            type="number"
            value={Age}
            placeholder=''
            onInput={e => setAge(e.target.value)}
            variant="standard"
            fullWidth
          />
          <p>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">الجنس</FormLabel>
              <RadioGroup
                row
                id="gender"
                name="radio-buttons-group"
                onInput={e => setGender(e.target.value)}
              >
                <FormControlLabel value="Female" control={<Radio />} label="امرأة" />
                <FormControlLabel value="Male" control={<Radio />} label="رجل" />
              </RadioGroup>
            </FormControl>
          </p>
        </Alert>
      </p>

      {/* Results Section */}
      <p>
        <Alert severity="success">
          {output ? output : outputMessage}
        </Alert>

      </p>

      {/* Contacts Us Section */}
      <p>
        <Alert severity="error" >
          {aboutMessage}
          <a href="mailto:samisaf@gmail.com">الرابط</a>
        </Alert>
      </p>
    </CacheProvider>
  )
}
