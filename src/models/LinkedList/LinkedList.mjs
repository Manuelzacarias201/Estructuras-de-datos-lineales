import Node from "./Node.mjs"

export class LinkedList {
    #count
    #head

    constructor() {
        this.#count = 0;
        this.#head = null;
    }

    push(bussines) {
        const newNode = new Node(bussines);
        if (this.#head === null) {
            this.#head = newNode;
        } else {
            let current = this.#head;
            while (current.next !== null) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.#count++; // Incrementa el #count después de agregar un nuevo nodo
    }

    getElementAt(index) {
        if (index >= 0 && index < this.#count) {
            let node = this.#head;
            for (let i = 0; i < index && node != null; i++)
                node = node.next;
            return node;
        }
        return undefined;
    }

    searchValue(value) {
        let node = this.#head;
        let iteraciones = 0;
        const lowerValue = value.trim().toLowerCase();

        while (node != null) {
            iteraciones++;
            const nodeData = node.getData();
            const nodeName = nodeData.name.trim().toLowerCase();

            if (lowerValue === nodeName) {
                return { node, iteraciones };
            }

            node = node.next;
        }

        console.log(`No encontrado después de ${iteraciones} iteraciones`);
        return { node: null, iteraciones };
    }

    size() {
        return this.#count;
    }

    isEmpty() {
        return this.size() === 0;
    }

    getList() {
        let current = this.#head;
        let result = '';
        while (current != null) {
            result += current.getData().name + (current.next ? ' => ' : '');
            current = current.next;
        }
        return result;
    }

    bubbleSort() {
        if (!this.#head || !this.#head.next) {
            return 0;
        }

        let swapped;
        let current;
        let prev = null;
        let iterations = 0;

        do {
            swapped = false;
            current = this.#head;

            while (current.next !== prev) {
                iterations++;
                if (current.data.name > current.next.data.name) {
                    let temp = current.data;
                    current.data = current.next.data;
                    current.next.data = temp;
                    swapped = true;
                }
                current = current.next;
            }
            prev = current;
        } while (swapped);

        console.log(`BubbleSort completed with ${iterations} iterations`);
        return iterations;
    }


    mergeSort() {
        if (!this.#head || !this.#head.next) {
            return 0;
        }
    
        let dummy = new Node(0);
        dummy.next = this.#head;
        let size = 1;
        let length = this.size();
        let iterations = 0; // Utiliza una variable local para contar las iteraciones
    
        while (size < length) {
            let current = dummy.next;
            let arreglo = dummy;
    
            while (current) {
                let left = current;
                let right = this.#split(left, size);
                current = this.#split(right, size);
    
                arreglo = this.#merge(left, right, arreglo, () => iterations++); // Utiliza una función para incrementar las iteraciones
            }
    
            size *= 2;
        }
    
        this.#head = dummy.next;
        console.log(`MergeSort completed with ${iterations} iterations`);
        return iterations;
    }
    
    #merge(left, right, tail, incrementIterations) {
        let current = tail;
    
        while (left && right) {
            incrementIterations(); // Incrementa las iteraciones utilizando la función
            if (left.data.name < right.data.name) {
                current.next = left;
                left = left.next;
            } else {
                current.next = right;
                right = right.next;
            }
            current = current.next;
        }
    
        current.next = left ? left : right;
    
        while (current.next) {
            current = current.next;
        }
    
        return current;
    }

    #split(head, size) {
        for (let i = 1; head && i < size; i++) {
            head = head.next;
        }

        if (!head) return null;

        let next = head.next;
        head.next = null;
        return next;
    }


    radixSort() {
        if (this.#head === null || this.#head.next === null) {
            return 0; 
        }

        let maxLen = this.#getMaxNameLength();
        let totalIterations = 0; 

        for (let exp = maxLen - 1; exp >= 0; exp--) {
            console.log(`Sorting with exp ${exp}`);
            totalIterations += this.#countingSort(exp);
        }

        return totalIterations; 
    }

    #countingSort(exp) {
        const output = new Array(this.#count);
        const count = new Array(256).fill(0);
        let iterations = 0;

        let current = this.#head;
        while (current !== null) {
            const index = this.#getCharCodeAt(current.getData().name, exp);
            count[index]++;
            current = current.next;
            iterations++;
        }

        for (let i = 1; i < 256; i++) {
            count[i] += count[i - 1];
        }

        const temp = new Array(this.#count); 
        current = this.#head;
        while (current !== null) {
            const index = this.#getCharCodeAt(current.getData().name, exp);
            temp[count[index] - 1] = current; 
            count[index]--;
            current = current.next;
            iterations++;
        }

        if (temp.some(node => node === undefined)) {
            console.error("Temp array contains undefined nodes:", temp);
        }

        this.#head = temp[0];
        current = this.#head;
        for (let i = 1; i < this.#count; i++) {
            if (temp[i] === undefined) {
                console.error(`Node at index ${i} is undefined. Temp array:`, temp);
                break;
            }
            current.next = temp[i];
            current = current.next;
        }
        if (current) {
            current.next = null;
        }

        console.log(`List after countingSort with exp ${exp}: ${this.getList()}`);
        return iterations
    }

    #getCharCodeAt(str, pos) {
        if (pos >= str.length) {
            return 0;
        }
        return str.charCodeAt(pos);
    }

    #getMaxNameLength() {
        let maxLen = 0;
        let current = this.#head;
        while (current !== null) {
            if (current.getData().name.length > maxLen) {
                maxLen = current.getData().name.length;
            }
            current = current.next;
        }
        return maxLen;
    }
}