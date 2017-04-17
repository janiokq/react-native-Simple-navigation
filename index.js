import React from 'react';
import {View,StyleSheet,Dimensions,Animated,Easing,NativeModules} from 'react-native';
const SCREEN_HEIGHT   = Dimensions.get('window').height;
const SCREEN_WIDTH  = Dimensions.get('window').width;
let  invariant = require('fbjs/lib/invariant');
const NativeAnimatedModule = NativeModules && NativeModules.NativeAnimatedModule;
//自制导航器   需要其他 功能 以后拓展


export default  class Road extends React.Component{
    constructor(props){
      super(props);
      this.state  = {
        routeStack:[this.props.initialRoute],
       }
       //当前页面
       this.activeIndexRoute  = 0;
       //页面ref  索引栈
       this._sceneRefs  = [];
       this._renderedSceneMap   =new Map();
       this._renderSceneAnimated  = [];
    }
    componentWillMount(){
        //初始化
    }
    componentDidMount(){
        //加载完成
    }

    //替换之前的路由
    replacePrevious(route){
      this.replaceAtIndex(route,this.state.routeStack.length-2)
    }

    //替换指定路由
    replaceAtIndex(route,index){
      this.state.routeStack[index] = route;
      this.setState({
        routeStack:this.state.routeStack
      })

    }

    getCurrentRoutes(){
      return  this.state.routeStack;
    }
    //push 方法
    push(route){
      //if(this.startAnimdet) return
      invariant(!!route, 'Must supply route to push');
      this.activeIndexRoute++;
      this.state.routeStack.push(route)
      this.setState({
        routeStack:this.state.routeStack
      },()=>{
        this._transitionTo(this.activeIndexRoute)
      })
    }
    pop(){
      this.popN(1);
    }
    popN(index){
        //if(this.startAnimdet) return
         this.activeIndexRoute  = (this.activeIndexRoute-index);
         this._transitionTo(this.activeIndexRoute,()=>{
                  this.state.routeStack.length  = this.activeIndexRoute+1;
                  this.setState({
                        routeStack:this.state.routeStack
                  })
        })
    }
    
    _transitionTo(index,cp){
      //debugger
      if(this._renderSceneAnimated[index]){
          //动画开始  屏蔽又  触摸操作
          this.transitionerBox.setNativeProps({pointerEvents:'none'})
          this.startAnimdet  =true
          if(index < (this.state.routeStack.length-1) ){
              //back
              this.state.routeStack.map((d,i)=>{
                if(i >= index+1 && i < this.parentIndex){
                    //中间的页面
                    this._sceneRefs[i].setNativeProps({
                       style:{
                         opacity:0
                       }
                    })
                }
              })
              let backindex = this.parentIndex
              this.parentIndex = index;
              Animated.timing(          
              this._renderSceneAnimated[backindex],
               { 
                toValue: SCREEN_WIDTH,
                useNativeDriver: true,
                duration: 350,
              },              

              ).start(()=>{
               this.startAnimdet  = false
               this.transitionerBox.setNativeProps({pointerEvents:'auto'})
                if(cp){
                  cp()
                }
            });
          }else{
             //push
             this.parentIndex  = index;
             Animated.timing(          
              this._renderSceneAnimated[this.parentIndex],    
              {   
                  toValue:0,
                  useNativeDriver: true,
                  duration: 350,
              },
            ).start(()=>{
              this.startAnimdet  = false;
              this.transitionerBox.setNativeProps({pointerEvents:'auto'})
              if(cp){
                  cp()
                }
            }); 
          }
      }
    }

    _renderScene(route, i) {
    var disabledSceneStyle = null;
    var disabledScenePointerEvents = 'auto';
    if (i !== this.state.presentedIndex) {
      disabledSceneStyle = styles.disabledScene;
      disabledScenePointerEvents = 'none';
    }
    //初始化动画
    if(i == 0){
      this._renderSceneAnimated[i] = new Animated.Value(0); 
    }else{
      this._renderSceneAnimated[i] = new Animated.Value(SCREEN_WIDTH) 
    }
    return (
      <Animated.View
        collapsable={false}
        key={'scene_'+i}
        ref={(scene) => {
          this._sceneRefs[i] = scene;
        }}
        //开始手势捕捉事件
        onStartShouldSetResponderCapture={() => {
          return false
        }}
        //不成为 触摸事件目标
        pointerEvents={'auto'}
        style={[styles.baseScene, this.props.sceneStyle,{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            transform: [{ translateX:this._renderSceneAnimated[i] }]
        }]}>
        {this.props.renderScene(
          route,
          this
        )}
      </Animated.View>
    );
  }

    render(){
        let newRenderedSceneMap  = new Map();
        let screen  = this.state.routeStack.map((route,index)=>{
              var renderedScene;
            if (this._renderedSceneMap.has(route) &&
                index !== this.state.presentedIndex) {
              renderedScene = this._renderedSceneMap.get(route);
            } else {
              renderedScene = this._renderScene(route, index);
            }
            newRenderedSceneMap.set(route, renderedScene);
            return renderedScene;
        });
        this._renderedSceneMap = newRenderedSceneMap;
        
        return(
            <View  style={styles.container}  >
              <View style={styles.transitioner}  pointerEvents={'auto'}  ref={(r)=> this.transitionerBox  =r } >
                {screen}
              </View>
            </View>
        )
    }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  defaultSceneStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    transform: [
      {translateX: 0},
      {translateY: 0},
      {scaleX: 1},
      {scaleY: 1},
      {rotate: '0deg'},
      {skewX: '0deg'},
      {skewY: '0deg'},
    ],
  },
  baseScene: {
    position: 'absolute',
    overflow: 'hidden',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  disabledScene: {
    top: SCREEN_HEIGHT,
    bottom: -SCREEN_HEIGHT,
  },
  transitioner: {
    flex: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  }
});
