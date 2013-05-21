jMVP.View = function() {

};

/*
    Stuff it needs

        Rename classNames property to css (css should always be class based anyway)

        Global config object parsing method
            Store in oMap like before (look for cleaner structure or have oMapAttribute, oMapCSS)
            - parser method
                - parse()
                - parseLoop()
                - storeHooks()

        Recursive DOM generation method
            - Only handle DOM creation nothing else
                - generateHtml(oView, [eParent])

        Fast access / return of DOM element
            - Using the current oNodesMap
                - getNodeByRef(sReference)
                - getNodes()

        Apply hooks
            - applyToRef(sReference)
            - applyAll()

        Looping
            - handle children inside loops
            - handle external data (not the actual loop data)
            - handle loop data in a clean way

        Updating
            Store in oMapLoop for easily checking if data used by a loop
            - handle string with hooks
            - handle array/object with loop handler if used by any loop config
            - stringify array/object with NO config loop
*/