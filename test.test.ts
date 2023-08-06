import { testrandom } from "../randomstring";
import assert from "assert";


describe("generate random string", () => {
    it("return a generated string", (done) => {
       const random = testrandom.generate(32); 
        console.log(`char: ${random}, length: ${random?.length}`); 
        done(); 
    })
})
