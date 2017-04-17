# react-native-Simple-navigation


This is a the react-native simplified version of the **Navigator**

Characteristics of the currently supported

Physical devices accelerate animation Original animation


**methods**：

push

popN

replacePrevious

replaceAtIndex

onRouteChange


Gestures are not currently supported



use:

```	
import  NavRoad  from 'react-native-Simple-navigation';



render(){
	return(
		
		      
            <NavRoad  
            
            	onRouteChange={(route,index)=>{
            		//operation
            	}}
              ref={(r)=> this.navigator  = r }
              initialRoute={{name: 'Index', component: TabView}}
              renderScene={(route,NavRoad)=>{
                 return (
                          <route.component    navigator = {NavRoad} route={route}  />
                        )
                }
              }
            />
            
	)
}

	
```
