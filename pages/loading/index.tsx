import { useRouter } from 'next/router'

import NavigateToTestBtn from '../../components/buttons/navigateToTestBtn'


function Loading() {
    const router = useRouter();
    const redirectToTest=()=>{
        router.push('./test')
    }
  return (
    <div>
        <div>
            <p>....Preparing Test Session</p>
        </div>
        <NavigateToTestBtn  navigate={redirectToTest}/>
    </div>
  )
}

export default Loading