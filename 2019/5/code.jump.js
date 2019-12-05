 class CodeJumpTrue {
     name = 'jump-if-true'
     code = 5

     constructor(computer) {
         this.computer = computer
     }

     run(offset, modes) {
         const valA = this.computer.gets(offset + 1, modes[0])
         const jumpAddr = this.computer.gets(offset + 2, modes[1]);
         if (valA != 0) {
             console.log('\t', this.name, 'to', jumpAddr)
             return jumpAddr - offset
         }

         return 3;
     }
 }
 class CodeJumpFalse {
     name = 'jump-if-False'
     code = 6

     constructor(computer) {
         this.computer = computer
     }

     run(offset, modes) {
         const valA = this.computer.gets(offset + 1, modes[0])
         const jumpAddr = this.computer.gets(offset + 2, modes[1]);
         if (valA == 0) {
             console.log('\t', this.name, 'to', jumpAddr, offset, jumpAddr - offset)
             return jumpAddr - offset
         }

         return 3;
     }
 }




 module.exports = {
     CodeJumpTrue,
     CodeJumpFalse
 }
