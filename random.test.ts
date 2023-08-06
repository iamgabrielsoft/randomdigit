import { testrandom } from "./randomstring";


describe("generate random string", () => {
    it("return a generated string", (done) => {
       const random = testrandom.generate(32); 
        console.log(`char: ${random}, length: ${random?.length}`); 
        done(); 
    })
})
