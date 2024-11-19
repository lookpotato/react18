
import { useState } from 'react'
import ReactDOM from 'react-dom'
import * as React from 'react'
console.log('React:', React)  // 看看导入了什么内容

function App() {
  const [num] = useState(100);
  return <div>{num}</div>
}

ReactDOM.createRoot(document.getElementById('root')! ).render(
<App />
)