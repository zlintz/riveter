/* global describe it beforeEach afterEach */

import Riveter from '../lib/riveter'
import expect = require('expect.js');

describe('riveter - inherits (stand-alone)', function () {
  let whichCtor: any[] = []

  const Person = function (this: any, name: string) {
    this.name = name
    whichCtor.push('Person')
  }
  Person.prototype.greet = function (this: any) {
    return 'Hi, ' + this.name
  }

  const VisitorProto = {
    sayGoodbye: function () {
      return 'Buh Bye....'
    }
  }

  const Employee: any = function (this: any, name: string, title: string, salary: number) {
    Employee.__super.call(this, name)
    this.title = title
    this.salary = salary
    whichCtor.push('Employee')
  }

  Employee.prototype.giveRaise = function (amount) {
    this.salary += amount
  }

  const CEOProto: any = {
    fireAllThePeeps: function () {
      return "YOU'RE ALL FIRED!"
    },
    constructor: function (this: any, name: string, title: string, salary: number, shouldExpectFbiRaid: boolean) {
      CEOProto.constructor.__super.call(this, name, title, salary)
      this.shouldExpectFbiRaid = shouldExpectFbiRaid
      whichCtor.push('CEO')
    }
  }

  Riveter.inherits(Employee, Person, {
    getInstance: function (name, title, salary) {
      return new Employee(name, title, salary)
    }
  })
  const Visitor: any = Riveter.inherits(VisitorProto, Person)
  const CEO: any = Riveter.inherits(CEOProto, Employee)

  describe('when passing constructor functions for parent and child', function () {
    let worker: any
    beforeEach(function () {
      worker = new Employee('Bugs', 'Bunny', 100000)
    })
    afterEach(function () {
      whichCtor = []
    })
    it('should mutate the child constructor function', function () {
      expect(Employee !== Person).to.be(true)
      expect(Employee.prototype.constructor).to.be(Employee)
      expect(Employee.__super.prototype).to.be(Person.prototype)
      expect(Employee.__super).to.be(Person)
      expect(Employee.__super__).to.be(Person.prototype)
    })
    it('should apply shared/constructor methods', function () {
      expect(Object.prototype.hasOwnProperty.call(Employee, 'mixin')).to.be(
        true
      )
      expect(Object.prototype.hasOwnProperty.call(Employee, 'extend')).to.be(
        true
      )
      expect(Object.prototype.hasOwnProperty.call(Employee, 'inherits')).to.be(
        true
      )
      expect(Object.prototype.hasOwnProperty.call(Employee, 'compose')).to.be(
        true
      )
      expect(
        Object.prototype.hasOwnProperty.call(Employee, 'getInstance')
      ).to.be(true)
      expect(
          Employee.getInstance('Test', 'Tester', 100) instanceof Employee
      ).to.be(true)
    })
    it('should call the child constructor', function () {
      expect(whichCtor).to.eql(['Person', 'Employee'])
    })
    it('should produce expected instance when used to instantiate new object', function () {
      expect(worker.name).to.be('Bugs')
      expect(worker.title).to.be('Bunny')
      expect(worker.salary).to.be(100000)
      expect(worker.greet()).to.be('Hi, Bugs')
    })
    it('should properly construct the instance prototype', function () {
      expect(Object.prototype.hasOwnProperty.call(worker, 'name')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(worker, 'title')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(worker, 'salary')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(worker, 'giveRaise')).to.be(
        false
      )
      expect(Object.prototype.hasOwnProperty.call(worker, 'greet')).to.be(false)
      expect(worker.greet).to.be(Person.prototype.greet)
      expect(worker.giveRaise).to.be(Employee.prototype.giveRaise)
    })
  })

  describe('when passing object literal (with a constructor) as the child', function () {
    let ceo: any
    beforeEach(function () {
      ceo = new CEO('Byron Whitefield', 'CEO', 1000000000, true)
    })
    afterEach(function () {
      whichCtor = []
    })

    it('should mutate the child constructor function', function () {
      expect(CEO !== Person).to.be(true)
      expect(CEO !== Employee).to.be(true)
      expect(CEO !== CEOProto).to.be(true)
      expect(CEO.prototype.constructor).to.be(CEOProto.constructor)
      expect(CEO.__super.prototype).to.be(Employee.prototype)
      expect(CEO.__super).to.be(Employee)
      expect(CEO.__super__).to.be(Employee.prototype)
    })
    it('should apply shared members', function () {
      expect(Object.prototype.hasOwnProperty.call(CEO, 'mixin')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(CEO, 'extend')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(CEO, 'inherits')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(CEO, 'compose')).to.be(true)
    })
    it('should call the child constructor', function () {
      expect(whichCtor).to.eql(['Person', 'Employee', 'CEO'])
    })
    it('should produce expected instance when used to instantiate new object', function () {
      expect(ceo.name).to.be('Byron Whitefield')
      expect(ceo.title).to.be('CEO')
      expect(ceo.salary).to.be(1000000000)
      expect(ceo.shouldExpectFbiRaid).to.be(true)
      expect(ceo.greet()).to.be('Hi, Byron Whitefield')
    })
    it('should properly construct the instance prototype', function () {
      expect(Object.prototype.hasOwnProperty.call(ceo, 'name')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(ceo, 'title')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(ceo, 'salary')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(ceo, 'giveRaise')).to.be(
        false
      )
      expect(Object.prototype.hasOwnProperty.call(ceo, 'greet')).to.be(false)
      expect(
        Object.prototype.hasOwnProperty.call(ceo, 'shouldExpectFbiRaid')
      ).to.be(true)
      expect(ceo.greet).to.be(Person.prototype.greet)
      expect(ceo.giveRaise).to.be(Employee.prototype.giveRaise)
    })
  })

  describe('when passing object literal (with no constructor method) as the child', function () {
    let visitor: any
    beforeEach(function () {
      visitor = new Visitor('FBI+IRS')
    })
    afterEach(function () {
      whichCtor = []
    })

    it('should mutate the child constructor function', function () {
      expect(Visitor !== Person).to.be(true)
      expect(Visitor.__super.prototype).to.be(Person.prototype)
      expect(Visitor.__super).to.be(Person)
      expect(Visitor.__super__).to.be(Person.prototype)
    })
    it('should call the parent constructor', function () {
      expect(whichCtor).to.eql(['Person'])
    })
    it('should apply shared members', function () {
      expect(Object.prototype.hasOwnProperty.call(Visitor, 'mixin')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(Visitor, 'extend')).to.be(
        true
      )
      expect(Object.prototype.hasOwnProperty.call(Visitor, 'inherits')).to.be(
        true
      )
      expect(Object.prototype.hasOwnProperty.call(Visitor, 'compose')).to.be(
        true
      )
    })
    it('should produce expected instance when used to instantiate new object', function () {
      expect(visitor.name).to.be('FBI+IRS')
      expect(visitor.greet()).to.be('Hi, FBI+IRS')
      expect(visitor.sayGoodbye()).to.be('Buh Bye....')
    })
    it('should properly construct the instance prototype', function () {
      expect(Object.prototype.hasOwnProperty.call(visitor, 'name')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(visitor, 'greet')).to.be(
        false
      )
      expect(Object.prototype.hasOwnProperty.call(visitor, 'sayGoodbye')).to.be(
        false
      )
      expect(visitor.greet).to.be(Person.prototype.greet)
      expect(visitor.sayGoodbye).to.be(VisitorProto.sayGoodbye)
    })
  })
})
