import{b as o}from"./chunk-TN4M2PHH.mjs";import{h as n,i as t}from"./chunk-INPTWVUC.mjs";var m=["com","us","biz","info","name","net","org"];var _={domain_suffix:m},i=_;var e=["{{location.city_prefix}} {{person.firstName}}{{location.city_suffix}}","{{location.city_prefix}} {{person.firstName}}","{{person.firstName}}{{location.city_suffix}}","{{person.lastName}}{{location.city_suffix}}"];var a=["Adams County","Calhoun County","Carroll County","Clark County","Clay County","Crawford County","Douglas County","Fayette County","Franklin County","Grant County","Greene County","Hamilton County","Hancock County","Henry County","Jackson County","Jefferson County","Johnson County","Lake County","Lawrence County","Lee County","Lincoln County","Logan County","Madison County","Marion County","Marshall County","Monroe County","Montgomery County","Morgan County","Perry County","Pike County","Polk County","Scott County","Union County","Warren County","Washington County","Wayne County"];var r=["United States","United States of America","USA"];var f={AK:{min:99501,max:99950},AL:{min:35004,max:36925},AR:{min:71601,max:72959},AZ:{min:85001,max:86556},CA:{min:90001,max:96162},CO:{min:80001,max:81658},CT:{min:6001,max:6389},DC:{min:20001,max:20039},DE:{min:19701,max:19980},FL:{min:32004,max:34997},GA:{min:30001,max:31999},HI:{min:96701,max:96898},IA:{min:50001,max:52809},ID:{min:83201,max:83876},IL:{min:60001,max:62999},IN:{min:46001,max:47997},KS:{min:66002,max:67954},KY:{min:40003,max:42788},LA:{min:70001,max:71232},MA:{min:1001,max:2791},MD:{min:20899,max:20908},ME:{min:3901,max:4992},MI:{min:48001,max:49971},MN:{min:55001,max:56763},MO:{min:63001,max:65899},MS:{min:38601,max:39776},MT:{min:59001,max:59937},NC:{min:27006,max:28909},ND:{min:58001,max:58856},NE:{min:68001,max:68118},NH:{min:3031,max:3897},NJ:{min:7001,max:8989},NM:{min:87001,max:88441},NV:{min:88901,max:89883},NY:{min:6390,max:6390},OH:{min:43001,max:45999},OK:{min:73001,max:73199},OR:{min:97001,max:97920},PA:{min:15001,max:19640},PR:{min:0,max:0},RI:{min:2801,max:2940},SC:{min:29001,max:29948},SD:{min:57001,max:57799},TN:{min:37010,max:38589},TX:{min:75503,max:79999},UT:{min:84001,max:84784},VA:{min:20040,max:20041},VT:{min:5001,max:5495},WA:{min:98001,max:99403},WI:{min:53001,max:54990},WV:{min:24701,max:26886},WY:{min:82001,max:83128}};var x=["{{person.firstName}} {{location.street_suffix}}","{{person.lastName}} {{location.street_suffix}}"];var D={city_pattern:e,county:a,default_country:r,postcode_by_state:f,street_pattern:x},u=D;var N={title:"English (United States)",code:"en_US",country:"US",language:"en",endonym:"English (United States)",dir:"ltr",script:"Latn"},p=N;var y=[{value:"{{person.last_name}}",weight:95},{value:"{{person.last_name}}-{{person.last_name}}",weight:5}];var M={last_name_pattern:y},s=M;var l=["201","202","203","205","206","207","208","209","210","212","213","214","215","216","217","218","219","224","225","227","228","229","231","234","239","240","248","251","252","253","254","256","260","262","267","269","270","276","281","283","301","302","303","304","305","307","308","309","310","312","313","314","315","316","317","318","319","320","321","323","330","331","334","336","337","339","347","351","352","360","361","386","401","402","404","405","406","407","408","409","410","412","413","414","415","417","419","423","424","425","434","435","440","443","445","464","469","470","475","478","479","480","484","501","502","503","504","505","507","508","509","510","512","513","515","516","517","518","520","530","540","541","551","557","559","561","562","563","564","567","570","571","573","574","580","585","586","601","602","603","605","606","607","608","609","610","612","614","615","616","617","618","619","620","623","626","630","631","636","641","646","650","651","660","661","662","667","678","682","701","702","703","704","706","707","708","712","713","714","715","716","717","718","719","720","724","727","731","732","734","737","740","754","757","760","763","765","770","772","773","774","775","781","785","786","801","802","803","804","805","806","808","810","812","813","814","815","816","817","818","828","830","831","832","835","843","845","847","848","850","856","857","858","859","860","862","863","864","865","870","872","878","901","903","904","906","907","908","909","910","912","913","914","915","916","917","918","919","920","925","928","931","936","937","940","941","947","949","952","954","956","959","970","971","972","973","975","978","979","980","984","985","989"];var C=["201","202","203","205","206","207","208","209","210","212","213","214","215","216","217","218","219","224","225","227","228","229","231","234","239","240","248","251","252","253","254","256","260","262","267","269","270","276","281","283","301","302","303","304","305","307","308","309","310","312","313","314","315","316","317","318","319","320","321","323","330","331","334","336","337","339","347","351","352","360","361","386","401","402","404","405","406","407","408","409","410","412","413","414","415","417","419","423","424","425","434","435","440","443","445","464","469","470","475","478","479","480","484","501","502","503","504","505","507","508","509","510","512","513","515","516","517","518","520","530","540","541","551","557","559","561","562","563","564","567","570","571","573","574","580","585","586","601","602","603","605","606","607","608","609","610","612","614","615","616","617","618","619","620","623","626","630","631","636","641","646","650","651","660","661","662","667","678","682","701","702","703","704","706","707","708","712","713","714","715","716","717","718","719","720","724","727","731","732","734","737","740","754","757","760","763","765","770","772","773","774","775","781","785","786","801","802","803","804","805","806","808","810","812","813","814","815","816","817","818","828","830","831","832","835","843","845","847","848","850","856","857","858","859","860","862","863","864","865","870","872","878","901","903","904","906","907","908","909","910","912","913","914","915","916","917","918","919","920","925","928","931","936","937","940","941","947","949","952","954","956","959","970","971","972","973","975","978","979","980","984","985","989"];var A={area_code:l,exchange_code:C},c=A;var L={internet:i,location:u,metadata:p,person:s,phone_number:c},d=L;var m0=new n({locale:[d,o,t]});export{d as a,m0 as b};
