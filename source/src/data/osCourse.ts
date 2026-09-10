import type { Lesson, QuizQuestion } from '../types'

export const osLessons: Lesson[] = [
  {
    id: 'os-role', number: '01', title: 'What an Operating System Is', eyebrow: 'One machine, safely shared', minutes: 12,
    summary: 'Define the operating system by its responsibilities and distinguish its privileged core from the software distributed around it.',
    objectives: ['Place the OS within the four-part computer system', 'Compare the user and system viewpoints', 'Distinguish the kernel, system programs, and middleware'],
    sections: [
      { title: 'The system in four layers', body: 'Hardware supplies CPU time, memory, and I/O devices. The operating system coordinates those resources for applications, while users or other systems direct the applications. The same hardware can therefore support many workloads without each application having to understand every controller or arbitrate every conflict itself.' },
      { title: 'Two viewpoints', body: 'From a user viewpoint, the OS should make the machine convenient and responsive. From a system viewpoint, it is both a resource allocator that decides who receives scarce resources and a control program that prevents incorrect or harmful use.' },
      { title: 'A practical boundary', body: 'There is no universal boundary around an operating system. This course uses the kernel, the privileged program that remains active, as the core definition. Shells, utilities, and daemons are system programs, while middleware provides higher-level services to applications.' },
      { title: 'Efficiency and fairness are different goals', body: 'A resource allocator may maximize throughput by favoring work that finishes quickly, yet a shared system must also prevent starvation and honor priorities. A control program complements allocation by supervising execution and I/O, detecting misuse, and preserving a stable environment when applications fail.' },
    ],
    keyTerms: ['operating system', 'resource allocator', 'control program', 'kernel', 'system program', 'middleware'], source: 'Chapter 1 slides 3-8',
  },
  {
    id: 'hardware-underneath', number: '02', title: 'The Hardware Underneath', eyebrow: 'Events, data, and processors', minutes: 22,
    summary: 'Follow control and data across CPUs, memory, controllers, storage levels, and modern multi-CPU organizations.',
    objectives: ['Trace boot and interrupt handling', 'Compare interrupts, traps, and DMA', 'Explain storage hierarchy trade-offs', 'Differentiate multicore, SMP, NUMA, and clusters'],
    sections: [
      { title: 'Boot, interrupts, and traps', body: 'Firmware runs a bootstrap program that initializes hardware and loads the kernel. After boot, hardware interrupts asynchronously report events such as completed I/O, while synchronous traps arise from the executing instruction through an error or deliberate system call. An interrupt number indexes a vector so the CPU can jump directly to the correct handler.' },
      { title: 'Moving and retaining data', body: 'Registers, caches, and main memory are fast but volatile; secondary and tertiary storage retain data at lower speed and cost per byte. Caching bridges speed gaps between levels. For block I/O, DMA lets a controller transfer data directly between a device and memory, interrupting the CPU once when the block is complete.', points: ['A device driver gives the kernel a uniform interface to a particular controller.', 'Interrupt-driven I/O is appropriate when transfers are small or infrequent.', 'Main memory cannot replace secondary storage because it is limited and volatile.'] },
      { title: 'More than one execution unit', body: 'A processor is a physical chip, while a core is a computation unit that executes instructions. SMP treats general-purpose CPUs as peers sharing memory. NUMA preserves one address space but makes local memory faster than remote memory. A cluster instead joins separate machines over a network, often for availability or parallel work.' },
      { title: 'An event from device to handler', body: 'A controller records status, raises an interrupt request, and causes the processor to save enough execution state to enter a kernel handler. The handler acknowledges the device, completes bookkeeping or wakes waiting work, and restores the interrupted context. Masking and prioritization let critical events be handled without uncontrolled nesting.' },
    ],
    keyTerms: ['bootstrap', 'interrupt', 'trap', 'interrupt vector', 'DMA', 'storage hierarchy', 'SMP', 'NUMA', 'cluster'], source: 'Chapter 1 slides 9-33',
  },
  {
    id: 'os-control', number: '03', title: 'How the OS Stays in Control', eyebrow: 'Useful work without surrendering privilege', minutes: 18,
    summary: 'Connect process switching, hardware modes, system calls, and timers into one protection and control model.',
    objectives: ['Contrast multiprogramming with multitasking', 'Explain dual-mode protection', 'Trace a system call into and out of the kernel', 'Describe how a timer restores OS control'],
    sections: [
      { title: 'Keeping the CPU productive', body: 'Multiprogramming keeps several processes resident and switches when one blocks, using I/O wait time to run another. Multitasking extends that mechanism with frequent switches to improve interactive response even when the current process has not blocked.' },
      { title: 'Two modes, one guarded doorway', body: 'User code runs without permission to execute privileged instructions. An interrupt, exception, or system call transfers control to kernel mode. For a system call, the kernel identifies the requested service, validates its parameters, performs the operation, and returns control in user mode.' },
      { title: 'The timer closes the loop', body: 'Before dispatching user code, the OS programs a hardware timer. Its later interrupt guarantees that control returns to the kernel even if the process loops forever or never requests a service. Timer management must itself be privileged, or a program could disable this safeguard.' },
      { title: 'Protection depends on hardware', body: 'The mode bit, privileged-instruction checks, memory protection, and timer all enforce boundaries below application code. The kernel still has to validate system-call numbers, pointers, lengths, permissions, and return values; entering kernel mode authorizes the kernel to act, not the caller to bypass policy.' },
    ],
    keyTerms: ['process', 'multiprogramming', 'multitasking', 'user mode', 'kernel mode', 'privileged instruction', 'system call', 'timer'], source: 'Chapter 1 slides 34-49',
  },
  {
    id: 'os-management', number: '04', title: 'What the OS Manages', eyebrow: 'Resources, identity, and isolation', minutes: 20,
    summary: 'Survey the resources an OS coordinates and the mechanisms that preserve correct access and consistent data.',
    objectives: ['Distinguish a program from a process', 'Summarize the major OS management areas', 'Explain cache coherency', 'Separate protection from security'],
    sections: [
      { title: 'Active work and its resources', body: 'A program is passive code stored in a file; a process is one execution of that code with a program counter, allocated resources, and CPU time. The OS creates, schedules, coordinates, and removes processes and threads, reclaiming reusable resources when execution ends.' },
      { title: 'Memory, files, storage, and I/O', body: 'Memory management tracks ownership and decides what data moves in or out. File systems provide logical persistent objects over physical media. Mass-storage management allocates space and schedules device access, while the I/O subsystem uses buffering, caching, and drivers to hide device-specific details.' },
      { title: 'Correct copies and controlled access', body: 'Caching can leave several copies of a value at different levels; cache coherency keeps private CPU caches consistent after an update. Protection enforces specified access rules inside the system. Security addresses deliberate threats, so valid protection rules alone cannot stop an attacker who has stolen valid credentials.', points: ['User and group IDs attach access identity to processes and threads.', 'Setuid can temporarily run a program with the file owner\'s effective user ID.', 'Protection mechanisms also isolate failures at subsystem boundaries.'] },
      { title: 'Coordination across managers', body: 'The management areas are interdependent: loading a process consumes memory, executable-file data, storage I/O, and CPU scheduling decisions. The OS maintains accounting and ownership metadata so that failure or termination can trigger orderly cleanup rather than leak resources or expose another process\'s data.' },
    ],
    keyTerms: ['program', 'process', 'memory management', 'file system', 'cache coherency', 'protection', 'security', 'user ID', 'setuid'], source: 'Chapter 1 slides 50-63',
  },
  {
    id: 'execution-environments', number: '05', title: 'Virtual Execution Environments', eyebrow: 'Extending the machine', minutes: 10,
    summary: 'Compare the two ways software can reproduce a computing environment and identify the layers of a virtualized system.',
    objectives: ['Contrast virtualization with emulation', 'Describe host, guest, and VMM roles', 'Explain why instruction translation is costly', 'Connect virtual machines to safe resource sharing'],
    sections: [
      { title: 'Virtualization versus emulation', body: 'Virtualization runs a guest built for the same underlying CPU architecture, avoiding instruction-by-instruction translation and approaching native speed. Emulation reproduces a different target architecture in software, translating instructions and usually paying a substantial performance cost.' },
      { title: 'Many environments, one host', body: 'A virtual machine manager divides physical resources among guest kernels, each of which behaves as though it owns a private computer. The underlying system is the host, and each virtualized system is a guest. The VMM preserves isolation while sharing the real processor, memory, and devices.' },
      { title: 'Where the abstraction pays', body: 'Virtual machines support consolidation, snapshots, testing, and isolation because each guest receives virtual processors, memory, disks, and devices. The VMM must intercept or safely virtualize sensitive operations and schedule guests over finite hardware, so overcommitment and I/O virtualization can still introduce contention even when CPU instructions run natively.' },
    ],
    keyTerms: ['emulation', 'virtualization', 'virtual machine manager', 'host', 'guest', 'native execution'], source: 'Chapter 1 slides 64-67',
  },
]

export const osQuizQuestions: QuizQuestion[] = [
  { id: 'os-q1', prompt: 'Which component best anchors the course definition of an operating system?', choices: ['Every program bundled by the vendor', 'The always-running kernel', 'Only the graphical desktop', 'All application middleware'], answer: 1, explanation: 'The boundary is contested, so the course anchors its definition on the privileged kernel that remains active.' },
  { id: 'os-q2', prompt: 'A disk controller signals that a read has completed while another program is executing. What event is this?', choices: ['An asynchronous hardware interrupt', 'A synchronous trap', 'A system call', 'A cache miss'], answer: 0, explanation: 'A controller raises a hardware interrupt independently of the current instruction stream.' },
  { id: 'os-q3', prompt: 'Why is DMA preferable to one interrupt per byte for a large disk transfer?', choices: ['It makes storage volatile', 'It translates guest instructions', 'It moves a block without continuous CPU involvement', 'It eliminates the device controller'], answer: 2, explanation: 'After setup, the DMA controller transfers the block directly between device and memory and interrupts once at completion.' },
  { id: 'os-q4', prompt: 'Which statement correctly distinguishes NUMA from a cluster?', choices: ['NUMA uses separate address spaces; clusters share one', 'NUMA shares one address space; cluster nodes are separate systems', 'NUMA has no processors; clusters do', 'NUMA requires emulation; clusters require virtualization'], answer: 1, explanation: 'NUMA processors share an address space despite unequal memory access times; cluster nodes are distinct computers connected by a network.' },
  { id: 'os-q5', prompt: 'Why does multiprogramming improve CPU utilization?', choices: ['Every process executes faster', 'The OS runs another ready process while one waits', 'It converts one core into several cores', 'It removes all I/O operations'], answer: 1, explanation: 'Multiprogramming fills time that would otherwise be idle when the current process blocks, usually for I/O.' },
  { id: 'os-q6', prompt: 'What should happen when user code attempts a privileged instruction?', choices: ['The instruction runs with reduced precision', 'The CPU ignores it silently', 'Hardware traps to the operating system', 'The mode bit remains in user mode and the device executes it'], answer: 2, explanation: 'Dual-mode hardware rejects privileged operations in user mode and transfers control to the kernel through a trap.' },
  { id: 'os-q7', prompt: 'What prevents an infinite user loop from keeping the CPU forever?', choices: ['A programmed timer interrupt', 'A larger disk cache', 'The bootstrap program', 'A group ID'], answer: 0, explanation: 'The OS sets a timer before dispatch; expiration interrupts the process and restores kernel control.' },
  { id: 'os-q8', prompt: 'Two users simultaneously execute the same program file. What exists?', choices: ['Two programs and no processes', 'One program and two processes', 'Two programs and one process', 'One program and one process'], answer: 1, explanation: 'The stored file is one passive program, while each execution has separate process state and resources.' },
  { id: 'os-q9', prompt: 'Which issue arises when two cores cache the same value and one core updates its copy?', choices: ['Graceful degradation', 'Cache coherency', 'Privilege escalation', 'Direct memory access'], answer: 1, explanation: 'Cache coherency mechanisms ensure that other private caches do not continue using a stale value.' },
  { id: 'os-q10', prompt: 'Rosetta translating PowerPC instructions for an Intel processor is an example of what?', choices: ['SMP', 'DMA', 'Virtualization', 'Emulation'], answer: 3, explanation: 'The source and target CPU architectures differ, so software must translate instructions; that is emulation.' },
]

export const osSemesterWeeks = [
  ['Sep 01-08', 'Operating-system foundations', 'Chapter 1', 'Available', 'OS roles, hardware, control, resource management, and execution environments'],
  ['Sep 15-17', 'Operating-system structures', 'Chapter 2', 'Available', 'Services, interfaces, system calls, design, implementation structures, booting, and debugging'],
  ['Sep 22-Oct 01', 'Processes and concurrency', 'Chapters 3-4', 'Provisional', 'Processes, interprocess communication, threads, and concurrency'],
  ['Oct 06-08', 'CPU scheduling', 'Chapter 5', 'Provisional', 'Scheduling criteria, algorithms, and multicore considerations'],
  ['Oct 13', 'Midterm I', 'Chapters 1-5', 'Provisional', 'First exam checkpoint during class'],
  ['Oct 15-Nov 03', 'Synchronization and deadlocks', 'Chapters 6-8', 'Provisional', 'Synchronization tools, classic examples, and deadlock handling'],
  ['Nov 05-19', 'Memory systems', 'Chapters 9-10', 'Provisional', 'Main-memory allocation and virtual memory'],
  ['Nov 24', 'Midterm II', 'Chapters 6-10', 'Provisional', 'Second exam checkpoint during class'],
  ['Dec 01-10', 'Storage, I/O, and file systems', 'Chapters 11-14', 'Provisional', 'Mass storage, I/O systems, and file-system interface and implementation'],
  ['TBD', 'Cumulative final', 'All covered chapters', 'Provisional', 'Comprehensive final examination'],
]

export const osGlossary: Array<[string, string]> = [
  ['Cache coherency', 'The requirement that multiple cached copies reflect updates consistently.'],
  ['Cluster', 'Separate computers connected to cooperate, often sharing storage or a service.'],
  ['Direct memory access', 'Block transfer between a device and memory without CPU handling of each unit.'],
  ['Emulation', 'Software reproduction of a different hardware architecture through instruction translation.'],
  ['Interrupt', 'An asynchronous hardware signal that transfers control to a kernel handler.'],
  ['Interrupt vector', 'A table mapping interrupt numbers to their service routines.'],
  ['Kernel', 'The privileged core of the operating system that remains active.'],
  ['Multiprogramming', 'Keeping several processes available so another can run when one blocks.'],
  ['NUMA', 'A shared-address-space design in which local memory access is faster than remote access.'],
  ['Privileged instruction', 'An instruction hardware permits only while executing in kernel mode.'],
  ['Process', 'An active program execution with state, resources, and a claim on CPU time.'],
  ['Protection', 'Mechanisms that enforce specified access to system resources.'],
  ['Security', 'Defense of the system against deliberate attacks and misuse.'],
  ['System call', 'A validated request by user code for a service performed by the kernel.'],
  ['Trap', 'A synchronous transfer to the kernel caused by the current instruction.'],
  ['Virtualization', 'Running same-architecture guest systems on abstracted physical hardware.'],
  ['Virtual machine manager', 'The layer that allocates host hardware among isolated guest systems.'],
]

export const osActivityIds = ['events', 'storage', 'system-call'] as const
