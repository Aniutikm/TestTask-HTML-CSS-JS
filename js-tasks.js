//1. Напишите функцию deepEqual для проверки двух обьектов на идентичность.

function deepEqual(obj1, obj2) {
    // Сначала проверяем, являются ли obj1 и obj2 объектами
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
      return obj1 === obj2; // Если не являются объектами, просто сравниваем их
    }
  
    // Затем проверяем количество свойств в объектах
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
  
    if (keys1.length !== keys2.length) {
      return false; // Если количество свойств разное, объекты не равны
    }
  
    // Перебираем все свойства объекта obj1
    for (let key of keys1) {
      if (!keys2.includes(key)) {
        return false; // Если ключ из obj1 отсутствует в obj2, объекты не равны
      }
  
      // Рекурсивно сравниваем значения свойств
      if (!deepEqual(obj1[key], obj2[key])) {
        return false; // Если значения свойств не равны, объекты не равны
      }
    }
  
    return true; // Если все проверки пройдены, объекты равны
  }
  
  console.log(deepEqual({name: 'test'}, {name: 'test'}));

  //2. Напишите функцию генератор chunkArray, которая возвращает итератор возвращающий части массива указанной длинны.

function* chunkArray(arr, chunkSize) {
    let index = 0;
  
    while (index < arr.length) {
      yield arr.slice(index, index + chunkSize);
      index += chunkSize;
    }
  }
  
  const iterator = chunkArray([1, 2, 3, 4, 5, 6, 7, 8], 3);
  
  console.log(iterator.next()); // { value: [1, 2, 3], done: false }

  //3. Напишите функцию обертку, которая на вход принимает массив функций и их параметров, а возвращает массив результатов их выполнения. Количество аргументов исполняемой функции не ограничено!
  
  function bulkRun(functionsAndParams) {
    return Promise.all(
      functionsAndParams.map(([func, params]) => {
        return new Promise((resolve) => {
          func(...params, (result) => {
            resolve(result);
          });
        });
      })
    );
  }
  
  const f1 = (cb) => {
    cb(1);
  };
  
  const f2 = (a, cb) => {
    cb(a);
  };
  
  const f3 = (a, b, cb) => {
    setTimeout(() => cb([a, b]), 1000);
  };
  
  bulkRun([
    [f1, []],
    [f2, [2]],
    [f3, [3, 4]],
  ]).then(console.log);

  //4. Напишите метод arrayToObject, который превращает массив в объект (использовать рекурсию).

  function arrayToObject(arr) {
    const obj = {};
    
    for (const item of arr) {
      const [key, value] = item;
      
      if (Array.isArray(value)) {
        // Если значение - массив, рекурсивно вызываем arrayToObject
        obj[key] = arrayToObject(value);
      } else {
        obj[key] = value;
      }
    }
    
    return obj;
  }
  
  const arr = [['name', 'developer'], ['age', 5], ['skills', [['html', 4], ['css', 5], ['js', 5]]]];
  
  const result = arrayToObject(arr);
  console.log(result);

  //5. Написать обратный метод (см. задачу 4) objectToArray, который из объекта создаст массив. 

  function objectToArray(obj) {
    const arr = [];
    
    for (const key in obj) {
      const value = obj[key];
      
      if (typeof value === 'object' && !Array.isArray(value)) {
        // Если значение - объект, рекурсивно вызываем objectToArray
        arr.push([key, objectToArray(value)]);
      } else {
        arr.push([key, value]);
      }
    }
    
    return arr;
  }
  
  const obj = {
    name: 'developer',
    age: 5,
    skills: {
      html: 4,
      css: 5,
      js: 5
    }
  };
  
  const result1 = objectToArray(obj);
  console.log(result1);

  //6. Есть функция primitiveMultiply, которая умножает числа, но случайным образом может выбрасывать исключения типа: NotificationException, ErrorException. Задача написать функцию обертку которая будет повторять вычисление при исключении NotificationException, но прекращать работу при исключениях ErrorException

  function NotificationException() {}
  function ErrorException() {}
  
  function primitiveMultiply(a, b) {
    const rand = Math.random();
    if (rand < 0.5) {
      return a * b;
    } else if (rand > 0.85) {
      throw new ErrorException();
    } else {
      throw new NotificationException();
    }
  }
  
  function reliableMultiply(a, b) {
    while (true) {
      try {
        return primitiveMultiply(a, b);
      } catch (error) {
        if (error instanceof ErrorException) {
          throw error; // Перебрасываем исключение ErrorException
        } else if (error instanceof NotificationException) {
          // Перехватываем исключение NotificationException и просто продолжаем цикл
          continue;
        } else {
          // Если это другое исключение, которое мы не ожидаем, выбрасываем его
          throw error;
        }
      }
    }
  }
  
  try {
    console.log(reliableMultiply(8, 8));
  } catch (error) {
    console.error("Ошибка:", error);
  }

  //7.  Напишите функцию, которая берет объект любой вложенности и преобразует ее в единую плоскую карту с разными уровнями, разделенными косой чертой ( '/').

  function mapObject(obj1, parentKey = '') {
    const result = {};
  
    for (const key in obj1) {
      const value = obj1[key];
      const newKey = parentKey ? `${parentKey}/${key}` : key;
  
      if (typeof value === 'object' && !Array.isArray(value)) {
        // Если значение - объект, вызываем функцию рекурсивно
        Object.assign(result, mapObject(value, newKey));
      } else {
        // В противном случае, добавляем пару ключ-значение в результат
        result[newKey] = value;
      }
    }
  
    return result;
  }
  
  const obj1 = {
    a: {
      b: {
        c: 12,
        d: 'Hello World',
      },
      e: [1, 2, 3],
    },
  };
  
  const flattenedObj = mapObject(obj1);
  console.log(flattenedObj);
  
  //8. Напишите функцию combos, которая принимает положительное целое число num и возвращает массив массивов положительных целых чисел, где сумма каждого массива равна  num.  Массивы не должны повторяться.
  
  function combos(num) {
    function generateCombinations(remaining, currentCombo, result) {
      if (remaining === 0) {
        result.push(currentCombo.slice());
        return;
      }
      if (remaining < 0) {
        return;
      }
  
      for (let i = 1; i <= remaining; i++) {
        if (currentCombo.length === 0 || i >= currentCombo[currentCombo.length - 1]) {
          currentCombo.push(i);
          generateCombinations(remaining - i, currentCombo, result);
          currentCombo.pop();
        }
      }
    }
  
    const result = [];
    generateCombinations(num, [], result);
    return result;
  }
  
  console.log(combos(3));
  console.log(combos(10));
  
  //9.  Напишите функцию add, которая бы работала следующим образом add(1)(2)(7)...(n). Количество последовательных визовов неограничено.
  function add(value) {
    let sum = value;
  
    function innerAdd(nextValue) {
      sum += nextValue;
      return innerAdd;
    }
  
    innerAdd.valueOf = function () {
      return sum;
    };
  
    return innerAdd;
  }
  
  console.log(Number(add(1)(2)));

  
  
  