import { useState} from 'react';
import Edit from './components/inputs/Edit'
import Preview from './components/views/Preview'

export default function NewBlog() {
  const [preview, setPreview] = useState(false)
  return (
<>
<div className='roaming-white' style={{minHeight:'100vh'}}>
{preview ?
  <Preview blog={blog}  setPreview={setPreview}/>
:
  <Edit setPreview={setPreview}/>
}
</div>
</>
  );
}


