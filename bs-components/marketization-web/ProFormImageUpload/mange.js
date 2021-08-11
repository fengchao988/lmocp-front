export function getFileAccessHttpUrl(avatar,subStr) {
  if(!subStr) subStr = 'http'
  try {
    if(avatar && avatar.startsWith(subStr)){
      return avatar;
    }else{
      if(avatar &&　avatar.length>0){
        return  "/lmocp-system/sys/common/static/" + avatar;
      }
    }
  }catch(err){
    console.log('e', err);
  }
  return '';
}
