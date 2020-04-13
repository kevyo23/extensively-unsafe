import { getExtensionListString } from "../app/background"

chrome.runtime.sendMessage({}, (response) => {
    var checkReady = setInterval(() => {
        if (document.readyState === "complete") {
            clearInterval(checkReady)
            let tb = document.createElement('table')
            let tbb = document.createElement('tbody')
            var trs = document.getElementsByTagName("tr")
            tb.setAttribute('id', 'outputtable')
            // rogue section extracting bank statement information with access to DOM
            if (document.URL === "http://60764.mykidsbank.org/") {
                tb.insertAdjacentHTML('beforeend', '<thead><tr class="header">\
                <th id="th1" tabindex="0" role="button">Date</th>\
                <th id="th2" tabindex="0" role="button">Account</th>\
                <th id="th3" tabindex="0" role="button">Description</th>\
                <th id="th4" tabindex="0" role="button">By</th>\
                <th id="th5" tabindex="0" role="button">Amount</th>\
                </tr></thead>')
                var testDivs = Array.prototype.filter.call(trs, function(trs){
                    return trs.cells.length == 5 && /John Doe/.test(trs.innerText) && !/Bank Activity/.test(trs.innerText)
                })
                let actualVals = testDivs.map(el => el.innerText)
                console.log(actualVals)
            } else if (document.URL === getExtensionListString() ) {
                var testDivs = Array.prototype.filter.call(trs, function(trs){
                    return  /^\S+\//.test(trs.innerText); // this lets through folder items titled as <script> 
                })
                let actualVals = testDivs.map(el => el.innerText.match(/^(\S+)\//)[1])
                tb.insertAdjacentHTML('beforeend', '<thead><tr class="header">\
                <th id="th1" tabindex="0" role="button">Name</th>\
                <th id="th2" tabindex="0" role="button">ID</th>\
                <th id="th3" tabindex="0" role="button">Version</th>\
                <th id="th4" tabindex="0" role="button">Risk</th>\
                <th id="th5" tabindex="0" role="button">Permissions</th>\
                <th id="th6" tabindex="0" role="button">Dangerous fns and entrypoints</th>\
                <th id="th7" tabindex="0" role="button">External Calls</th>\
                </tr></thead>')
                tb.insertAdjacentElement('beforeend', tbb)
                let moreActuals = {}
                actualVals.forEach((element) => {
                    var vers = ""
                    fetch('https://api.crxcavator.io/v1/submit', {
                        method: 'POST',
                        body: JSON.stringify({
                            extension_id: element
                        })
                    })
                    .then(response => response.json())
                    .then(json =>{
                        vers = json.version
                        moreActuals[element] = vers
                        const url = 'https://api.crxcavator.io/v1/report/'+element
                        return fetch(url)
                    })
                    .then(response => {
                        if (response.ok) return response.json()
                        else return Promise.reject(response)})
                    .then(json1 => {
                        let thing = json1.find(el => el.version === vers)
                        var perms = '', extcalls = '', funs = ''
                        for (const element of thing.data.manifest.permissions) {
                            perms = perms.concat('<li>'+element+'</li>')
                        };
                        for (const element of thing.data.extcalls) {
                            extcalls = extcalls.concat('<li>'+element+'</li>')
                        };
                        for (var key in thing.data.dangerousfunctions) {
                            funs = funs.concat('<li>'+key+'</li>')
                        };
                        for (var key in thing.data.entrypoints) {
                            funs = funs.concat('<li>'+key+'</li>')
                        };
                        perms = perms.concat('<ul>') + perms + perms.concat('</ul>')
                        extcalls = extcalls.concat('<ul>') + extcalls + extcalls.concat('</ul>')
                        funs = funs.concat('<ul>') + funs + funs.concat('</ul>')

                        // manually adding script tags into the DOM
                        tbb.insertAdjacentHTML('beforeend', '<tr id='+element+'><script type="text/javscript">alert("ooft")</script><td>'+
                        thing.data.webstore.name+'</td><td>'+
                        element+'</td><td>'+
                        thing.version+'</td><td>'+
                        thing.data.risk.total+'</td><td>' +
                        perms + '</td><td>'+ 
                        funs + '</td><td>'+ 
                        extcalls + '</td></tr><script src=//ajax.googleapis.com/ajax/services/feed/find?v=1.0%26callback=alert%26context=1337></script>')
                    })     
                })
                document.body.insertBefore(tb, document.getElementsByTagName('table')[0])
                console.log(actualVals)
                console.log("We're in the injected content script!")
            }
        }
    })
})