# 详细的设计模式
## 1.单例模式（Singleton）
在有些系统中，为了节省内存资源、保证数据内容的一致性，对某些类要求只能创建一个实例，这就是所谓的单例模式。
### 单例模式的定义与特点
单例（Singleton）模式的定义：指一个类只有一个实例，且该类能自行创建这个实例的一种模式。例如，Windows 中只能打开一个任务管理器，这样可以避免因打开多个任务管理器窗口而造成内存资源的浪费，或出现各个窗口显示内容的不一致等错误。
<br/>
在计算机系统中，还有 Windows 的回收站、操作系统中的文件系统、多线程中的线程池、显卡的驱动程序对象、打印机的后台处理服务、应用程序的日志对象、数据库的连接池、网站的计数器、Web 应用的配置对象、应用程序中的对话框、系统中的缓存等常常被设计成单例。
<br/>
单例模式有 3 个特点：
- 1.单例类只有一个实例对象；
- 2.该单例对象必须由单例类自行创建；
- 3.单例类对外提供一个访问该单例的全局访问点；
### 单例模式的结构与实现
单例模式是设计模式中最简单的模式之一。通常，普通类的构造函数是公有的，外部类可以通过“new 构造函数()”来生成多个实例。但是，如果将类的构造函数设为私有的，外部类就无法调用该构造函数，也就无法生成多个实例。这时该类自身必须定义一个静态私有实例，并向外提供一个静态的公有函数用于创建或获取该静态私有实例。

#### 1. 单例模式的结构
单例模式的主要角色如下。
- 单例类：包含一个实例且能自行创建这个实例的类。
- 访问类：使用单例的类。
<br/>
![](/images/design/9.gif)
<br/>
图1 单例模式的结构图
#### 2. 单例模式的实现
Singleton 模式通常有两种实现形式。
##### 第 1 种：懒汉式单例
该模式的特点是类加载时没有生成单例，只有当第一次调用 getlnstance 方法时才去创建这个单例。代码如下：
```java
public class LazySingleton
{
    private static volatile LazySingleton instance=null;    //保证 instance 在所有线程中同步
    private LazySingleton(){}    //private 避免类在外部被实例化
    public static synchronized LazySingleton getInstance()
    {
        //getInstance 方法前加同步
        if(instance==null)
        {
            instance=new LazySingleton();
        }
        return instance;
    }
}
```
注意：如果编写的是多线程程序，则不要删除上例代码中的关键字 volatile 和 synchronized，否则将存在线程非安全的问题。如果不删除这两个关键字就能保证线程安全，但是每次访问时都要同步，会影响性能，且消耗更多的资源，这是懒汉式单例的缺点。
##### 第 2 种：饿汉式单例
该模式的特点是类一旦加载就创建一个单例，保证在调用 getInstance 方法之前单例已经存在了。
```java
public class HungrySingleton
{
    private static final HungrySingleton instance=new HungrySingleton();
    private HungrySingleton(){}
    public static HungrySingleton getInstance()
    {
        return instance;
    }
}
```
饿汉式单例在类创建的同时就已经创建好一个静态的对象供系统使用，以后不再改变，所以是线程安全的，可以直接用于多线程而不会出现问题。
### 单例模式的应用实例
#### 用懒汉式单例模式模拟产生美国当今总统对象。
分析：在每一届任期内，美国的总统只有一人，所以本实例适合用单例模式实现，图 2 所示是用懒汉式单例实现的结构图。
<br/>
![](/images/design/10.gif)
<br/>
图2 美国总统生成器的结构图
<br/>
```java
public class SingletonLazy
{
    public static void main(String[] args)
    {
        President zt1=President.getInstance();
        zt1.getName();    //输出总统的名字
        President zt2=President.getInstance();
        zt2.getName();    //输出总统的名字
        if(zt1==zt2)
        {
           System.out.println("他们是同一人！");
        }
        else
        {
           System.out.println("他们不是同一人！");
        }
    }
}
class President
{
    private static volatile President instance=null;    //保证instance在所有线程中同步
    //private避免类在外部被实例化
    private President()
    {
        System.out.println("产生一个总统！");
    }
    public static synchronized President getInstance()
    {
        //在getInstance方法上加同步
        if(instance==null)
        {
               instance=new President();
        }
        else
        {
           System.out.println("已经有一个总统，不能产生新总统！");
        }
        return instance;
    }
    public void getName()
    {
        System.out.println("我是美国总统：特朗普。");
    }  
}
```
程序运行结果如下：
```info
产生一个总统！
我是美国总统：特朗普。
已经有一个总统，不能产生新总统！
我是美国总统：特朗普。
他们是同一人！
```
#### 用饿汉式单例模式模拟产生猪八戒对象。
分析：同上例类似，猪八戒也只有一个，所以本实例同样适合用单例模式实现。本实例由于要显示猪八戒的图像（[点此下载该程序所要显示的猪八戒图片](/images/design/Bajie.jpg)），所以用到了框架窗体 JFrame 组件，这里的猪八戒类是单例类，可以将其定义成面板 JPanel 的子类，里面包含了标签，用于保存猪八戒的图像，客户窗体可以获得猪八戒对象，并显示它。图 3 所示是用饿汉式单例实现的结构图。
```java
import java.awt.*;
import javax.swing.*;
public class SingletonEager
{
    public static void main(String[] args)
    {
        JFrame jf=new JFrame("饿汉单例模式测试");
        jf.setLayout(new GridLayout(1,2));
        Container contentPane=jf.getContentPane();
        Bajie obj1=Bajie.getInstance();
        contentPane.add(obj1);    
        Bajie obj2=Bajie.getInstance(); 
        contentPane.add(obj2);
        if(obj1==obj2)
        {
            System.out.println("他们是同一人！");
        }
        else
        {
            System.out.println("他们不是同一人！");
        }   
        jf.pack();       
        jf.setVisible(true);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }
}
class Bajie extends JPanel
{
    private static Bajie instance=new Bajie();
    private Bajie()
    { 
        JLabel l1=new JLabel(new ImageIcon("src/Bajie.jpg"));
        this.add(l1);   
    }
    public static Bajie getInstance()
    {
        return instance;
    }
}
```

### 单例模式的应用场景
前面分析了单例模式的结构与特点，以下是它通常适用的场景的特点。
- 在应用场景中，某类只要求生成一个对象的时候，如一个班中的班长、每个人的身份证号等。
- 当对象需要被共享的场合。由于单例模式只允许创建一个对象，共享该对象可以节省内存，并加快对象访问速度。如 Web 中的配置对象、数据库的连接池等。
- 当某类需要频繁实例化，而创建的对象又频繁被销毁的时候，如多线程的线程池、网络连接池等。
#### 单例模式的扩展
单例模式可扩展为有限的多例（Multitcm）模式，这种模式可生成有限个实例并保存在 ArrayList 中，客户需要时可随机获取，其结构图如图 5 所示。
<br/>
![](/images/design/12.gif)
<br/>


## 2.原型模式(Prototype)
:::tip 说明
原型模式在java中主要是使用clone()方法复制，就是复制对象
<br/>
克隆：浅克隆和深克隆
:::
在有些系统中，存在大量相同或相似对象的创建问题，如果用传统的构造函数来创建对象，会比较复杂且耗时耗资源，用原型模式生成对象就很高效，就像孙悟空拔下猴毛轻轻一吹就变出很多孙悟空一样简单。
### 原型模式的定义与特点
原型（Prototype）模式的定义如下：用一个已经创建的实例作为原型，通过复制该原型对象来创建一个和原型相同或相似的新对象。在这里，原型实例指定了要创建的对象的种类。用这种方式创建对象非常高效，根本无须知道对象创建的细节。例如，Windows 操作系统的安装通常较耗时，如果复制就快了很多。在生活中复制的例子非常多，这里不一一列举了。
### 原型模式的结构与实现
由于 Java 提供了对象的 clone() 方法，所以用 Java 实现原型模式很简单。
#### 1. 模式的结构
原型模式包含以下主要角色。
- 1.抽象原型类：规定了具体原型对象必须实现的接口。
- 2.具体原型类：实现抽象原型类的 clone() 方法，它是可被复制的对象。
- 3.访问类：使用具体原型类中的 clone() 方法来复制新的对象。
<br/>
![](/images/design/13.gif)
<br/>
#### 2. 模式的实现
原型模式的克隆分为浅克隆和深克隆，Java 中的 Object 类提供了浅克隆的 clone() 方法，具体原型类只要实现 Cloneable 接口就可实现对象的浅克隆，这里的 Cloneable 接口就是抽象原型类。其代码如下：
```java
//具体原型类
class Realizetype implements Cloneable
{
    Realizetype()
    {
        System.out.println("具体原型创建成功！");
    }
    public Object clone() throws CloneNotSupportedException
    {
        System.out.println("具体原型复制成功！");
        return (Realizetype)super.clone();
    }
}
//原型模式的测试类
public class PrototypeTest
{
    public static void main(String[] args)throws CloneNotSupportedException
    {
        Realizetype obj1=new Realizetype();
        Realizetype obj2=(Realizetype)obj1.clone();
        System.out.println("obj1==obj2?"+(obj1==obj2));
    }
}
```
运行结果：
```info
具体原型创建成功！
具体原型复制成功！
obj1==obj2?false
```
### 原型模式的应用实例
#### 1.用原型模式模拟“孙悟空”复制自己。
分析：孙悟空拔下猴毛轻轻一吹就变出很多孙悟空，这实际上是用到了原型模式。这里的孙悟空类 SunWukong 是具体原型类，而 Java 中的 Cloneable 接口是抽象原型类。
<br/>
同前面介绍的猪八戒实例一样，由于要显示孙悟空的图像（[点击此处下载该程序所要显示的孙悟空的图片](/images/design/Wukong.jpg)），所以将孙悟空类定义成面板 JPanel 的子类，里面包含了标签，用于保存孙悟空的图像。
<br/>
另外，重写了 Cloneable 接口的 clone() 方法，用于复制新的孙悟空。访问类可以通过调用孙悟空的 clone() 方法复制多个孙悟空，并在框架窗体 JFrame 中显示。图 2 所示是其结构图。
```java
import java.awt.*;
import javax.swing.*;
class SunWukong extends JPanel implements Cloneable
{
    private static final long serialVersionUID = 5543049531872119328L;
    public SunWukong()
    {
        JLabel l1=new JLabel(new ImageIcon("src/Wukong.jpg"));
        this.add(l1);   
    }
    public Object clone()
    {
        SunWukong w=null;
        try
        {
            w=(SunWukong)super.clone();
        }
        catch(CloneNotSupportedException e)
        {
            System.out.println("拷贝悟空失败!");
        }
        return w;
    }
}
public class ProtoTypeWukong
{
    public static void main(String[] args)
    {
        JFrame jf=new JFrame("原型模式测试");
        jf.setLayout(new GridLayout(1,2));
        Container contentPane=jf.getContentPane();
        SunWukong obj1=new SunWukong();
        contentPane.add(obj1);       
        SunWukong obj2=(SunWukong)obj1.clone();
        contentPane.add(obj2);   
        jf.pack();       
        jf.setVisible(true);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);   
    }
}
```
运行结果:
<br/>
![](/images/design/14.gif)
<br/>
<br/>
用原型模式除了可以生成相同的对象，还可以生成相似的对象，请看以下实例。

#### 【例2】用原型模式生成“三好学生”奖状。
分析：同一学校的“三好学生”奖状除了获奖人姓名不同，其他都相同，属于相似对象的复制，同样可以用原型模式创建，然后再做简单修改就可以了。图 4 所示是三好学生奖状生成器的结构图。
<br/>
![](/images/design/15.gif)
<br/>
图4 奖状生成器的结构图
<br/>
```java
public class ProtoTypeCitation
{
    public static void main(String[] args) throws CloneNotSupportedException
    {
        citation obj1=new citation("张三","同学：在2016学年第一学期中表现优秀，被评为三好学生。","韶关学院");
        obj1.display();
        citation obj2=(citation) obj1.clone();
        obj2.setName("李四"); 
        obj2.display();
    }
}
//奖状类
class citation implements Cloneable
{
    String name;
    String info;
    String college;
    citation(String name,String info,String college)
    {
        this.name=name;
        this.info=info;
        this.college=college;
        System.out.println("奖状创建成功！");
    }
    void setName(String name)
    {
        this.name=name;
    }
    String getName()
    {
        return(this.name);
    }
    void display()
    {
        System.out.println(name+info+college);
    }
    public Object clone() throws CloneNotSupportedException
    {
        System.out.println("奖状拷贝成功！");
        return (citation)super.clone();
    }
}
```
程序运行结果如下：
```info
奖状创建成功！
张三同学：在2016学年第一学期中表现优秀，被评为三好学生。韶关学院
奖状拷贝成功！
李四同学：在2016学年第一学期中表现优秀，被评为三好学生。韶关学院
```

### 原型模式的应用场景
原型模式通常适用于以下场景。
- 1.对象之间相同或相似，即只是个别的几个属性不同的时候。
- 2.对象的创建过程比较麻烦，但复制比较简单的时候。

### 原型模式的扩展
原型模式可扩展为带原型管理器的原型模式，它在原型模式的基础上增加了一个原型管理器 PrototypeManager 类。该类用 HashMap 保存多个复制的原型，Client 类可以通过管理器的 get(String id) 方法从中获取复制的原型。其结构图如图 5 所示。
<br/>
![](/images/design/16.gif)
<br/>
图5 带原型管理器的原型模式的结构图
<br/>
#### 用例
##### 【例3】用带原型管理器的原型模式来生成包含“圆”和“正方形”等图形的原型，并计算其面积。分析：本实例中由于存在不同的图形类，例如，“圆”和“正方形”，它们计算面积的方法不一样，所以需要用一个原型管理器来管理它们，图 6 所示是其结构图。
![](/images/design/17.gif)
<br/>
图6 图形生成器的结构图
<br/>
```java
import java.util.*;
interface Shape extends Cloneable
{
    public Object clone();    //拷贝
    public void countArea();    //计算面积
}
class Circle implements Shape
{
    public Object clone()
    {
        Circle w=null;
        try
        {
            w=(Circle)super.clone();
        }
        catch(CloneNotSupportedException e)
        {
            System.out.println("拷贝圆失败!");
        }
        return w;
    }
    public void countArea()
    {
        int r=0;
        System.out.print("这是一个圆，请输入圆的半径：");
        Scanner input=new Scanner(System.in);
        r=input.nextInt();
        System.out.println("该圆的面积="+3.1415*r*r+"\n");
    }
}
class Square implements Shape
{
    public Object clone()
    {
        Square b=null;
        try
        {
            b=(Square)super.clone();
        }
        catch(CloneNotSupportedException e)
        {
            System.out.println("拷贝正方形失败!");
        }
        return b;
    }
    public void countArea()
    {
        int a=0;
        System.out.print("这是一个正方形，请输入它的边长：");
        Scanner input=new Scanner(System.in);
        a=input.nextInt();
        System.out.println("该正方形的面积="+a*a+"\n");
    }
}
class ProtoTypeManager
{
    private HashMap<String, Shape>ht=new HashMap<String,Shape>(); 
    public ProtoTypeManager()
    {
        ht.put("Circle",new Circle());
           ht.put("Square",new Square());
    } 
    public void addshape(String key,Shape obj)
    {
        ht.put(key,obj);
    }
    public Shape getShape(String key)
    {
        Shape temp=ht.get(key);
        return (Shape) temp.clone();
    }
}
public class ProtoTypeShape
{
    public static void main(String[] args)
    {
        ProtoTypeManager pm=new ProtoTypeManager();    
        Shape obj1=(Circle)pm.getShape("Circle");
        obj1.countArea();          
        Shape obj2=(Shape)pm.getShape("Square");
        obj2.countArea();     
    }
}
```
运行结果：
```info
这是一个圆，请输入圆的半径：3
该圆的面积=28.2735

这是一个正方形，请输入它的边长：3
该正方形的面积=9
```


## 3.工厂方法模式(FactoryMethod)
在现实生活中社会分工越来越细，越来越专业化。各种产品有专门的工厂生产，彻底告别了自给自足的小农经济时代，这大大缩短了产品的生产周期，提高了生产效率。同样，在软件开发中能否做到软件对象的生产和使用相分离呢？能否在满足“开闭原则”的前提下，客户随意增删或改变对软件相关对象的使用呢？这就是本节要讨论的问题。
### 模式的定义与特点
工厂方法（FactoryMethod）模式的定义：定义一个创建产品对象的工厂接口，将产品对象的实际创建工作推迟到具体子工厂类当中。这满足创建型模式中所要求的“创建与使用相分离”的特点。
<br/>
我们把被创建的对象称为“产品”，把创建产品的对象称为“工厂”。如果要创建的产品不多，只要一个工厂类就可以完成，这种模式叫“简单工厂模式”，它不属于 GoF 的 23 种经典设计模式，它的缺点是增加新产品时会违背“开闭原则”。
<br/>
本节介绍的“工厂方法模式”是对简单工厂模式的进一步抽象化，其好处是可以使系统在不修改原来代码的情况下引进新的产品，即满足开闭原则。
<br/>
工厂方法模式的主要优点有：
- 用户只需要知道具体工厂的名称就可得到所要的产品，无须知道产品的具体创建过程；
- 在系统增加新的产品时只需要添加具体产品类和对应的具体工厂类，无须对原工厂进行任何修改，满足开闭原则；
<br/>
其缺点是：每增加一个产品就要增加一个具体产品类和一个对应的具体工厂类，这增加了系统的复杂度。

### 模式的结构与实现
工厂方法模式由抽象工厂、具体工厂、抽象产品和具体产品等4个要素构成。本节来分析其基本结构和实现方法。
#### 1. 模式的结构
工厂方法模式的主要角色如下。
- 1.抽象工厂（Abstract Factory）：提供了创建产品的接口，调用者通过它访问具体工厂的工厂方法 newProduct() 来创建产品。
- 2.具体工厂（ConcreteFactory）：主要是实现抽象工厂中的抽象方法，完成具体产品的创建。
- 3.抽象产品（Product）：定义了产品的规范，描述了产品的主要特性和功能。
- 4.具体产品（ConcreteProduct）：实现了抽象产品角色所定义的接口，由具体工厂来创建，它同具体工厂之间一一对应。
<br/>
![](/images/design/18.gif)
<br/>
图1 工厂方法模式的结构图

#### 2. 模式的实现
```java
package FactoryMethod;
public class AbstractFactoryTest
{
    public static void main(String[] args)
    {
        try
        {
            Product a;
            AbstractFactory af;
            af=(AbstractFactory) ReadXML1.getObject();
            a=af.newProduct();
            a.show();
        }
        catch(Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}
//抽象产品：提供了产品的接口
interface Product
{
    public void show();
}
//具体产品1：实现抽象产品中的抽象方法
class ConcreteProduct1 implements Product
{
    public void show()
    {
        System.out.println("具体产品1显示...");
    }
}
//具体产品2：实现抽象产品中的抽象方法
class ConcreteProduct2 implements Product
{
    public void show()
    {
        System.out.println("具体产品2显示...");
    }
}
//抽象工厂：提供了厂品的生成方法
interface AbstractFactory
{
    public Product newProduct();
}
//具体工厂1：实现了厂品的生成方法
class ConcreteFactory1 implements AbstractFactory
{
    public Product newProduct()
    {
        System.out.println("具体工厂1生成-->具体产品1...");
        return new ConcreteProduct1();
    }
}
//具体工厂2：实现了厂品的生成方法
class ConcreteFactory2 implements AbstractFactory
{
    public Product newProduct()
    {
        System.out.println("具体工厂2生成-->具体产品2...");
        return new ConcreteProduct2();
    }
}
```

```java
package FactoryMethod;
import javax.xml.parsers.*;
import org.w3c.dom.*;
import java.io.*;
class ReadXML1
{
    //该方法用于从XML配置文件中提取具体类类名，并返回一个实例对象
    public static Object getObject()
    {
        try
        {
            //创建文档对象
            DocumentBuilderFactory dFactory=DocumentBuilderFactory.newInstance();
            DocumentBuilder builder=dFactory.newDocumentBuilder();
            Document doc;                           
            doc=builder.parse(new File("src/FactoryMethod/config1.xml"));        
            //获取包含类名的文本节点
            NodeList nl=doc.getElementsByTagName("className");
            Node classNode=nl.item(0).getFirstChild();
            String cName="FactoryMethod."+classNode.getNodeValue();
            //System.out.println("新类名："+cName);
            //通过类名生成实例对象并将其返回
            Class<?> c=Class.forName(cName);
              Object obj=c.newInstance();
            return obj;
         }  
         catch(Exception e)
         {
                   e.printStackTrace();
                   return null;
         }
    }
}
```
注意：该程序中用到了 XML 文件，如果想要获取该文件，请点击“[下载](http://c.biancheng.net/uploads/soft/181113/3-1Q114140222.zip)”，就可以对其进行下载。

### 模式的应用实例
#### 【例1】用工厂方法模式设计畜牧场。
分析：有很多种类的畜牧场，如养马场用于养马，养牛场用于养牛，所以该实例用工厂方法模式比较适合。
<br/>
对养马场和养牛场等具体工厂类，只要定义一个生成动物的方法 newAnimal() 即可。由于要显示马类和牛类等具体产品类的图像，所以它们的构造函数中用到了 JPanel、JLabd 和 ImageIcon 等组件，并定义一个 show() 方法来显示它们。
<br/>
客户端程序通过对象生成器类 ReadXML2 读取 XML 配置文件中的数据来决定养马还是养牛。其结构图如图 2 所示。
<br/>
![](/images/design/19.gif)
<br/>
注意：该程序中用到了 XML 文件，并且要显示马类和牛类等具体产品类的图像，如果想要获取 HTML 文件和图片，请点击“[下载](http://c.biancheng.net/uploads/soft/181113/3-1Q114140526.zip)”，就可以对其进行下载。
<br/>
```java
package FactoryMethod;
import java.awt.*;
import javax.swing.*;
public class AnimalFarmTest
{
    public static void main(String[] args)
    {
        try
        {
            Animal a;
            AnimalFarm af;
            af=(AnimalFarm) ReadXML2.getObject();
            a=af.newAnimal();
            a.show();
        }
        catch(Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}
//抽象产品：动物类
interface Animal
{
    public void show();
}
//具体产品：马类
class Horse implements Animal
{
    JScrollPane sp;
    JFrame jf=new JFrame("工厂方法模式测试");
    public Horse()
    {
        Container contentPane=jf.getContentPane();
        JPanel p1=new JPanel();
        p1.setLayout(new GridLayout(1,1));
        p1.setBorder(BorderFactory.createTitledBorder("动物：马"));
        sp=new JScrollPane(p1);
        contentPane.add(sp, BorderLayout.CENTER);
        JLabel l1=new JLabel(new ImageIcon("src/A_Horse.jpg"));
        p1.add(l1);       
        jf.pack();       
        jf.setVisible(false);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);    //用户点击窗口关闭 
    }
    public void show()
    {
        jf.setVisible(true);
    }
}
//具体产品：牛类
class Cattle implements Animal
{
    JScrollPane sp;
    JFrame jf=new JFrame("工厂方法模式测试");
    public Cattle()
    {
        Container contentPane=jf.getContentPane();
        JPanel p1=new JPanel();
        p1.setLayout(new GridLayout(1,1));
        p1.setBorder(BorderFactory.createTitledBorder("动物：牛"));
        sp=new JScrollPane(p1);
        contentPane.add(sp,BorderLayout.CENTER);
        JLabel l1=new JLabel(new ImageIcon("src/A_Cattle.jpg"));
        p1.add(l1);       
        jf.pack();       
        jf.setVisible(false);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);    //用户点击窗口关闭 
    }
    public void show()
    {
        jf.setVisible(true);
    }
}
//抽象工厂：畜牧场
interface AnimalFarm
{
    public Animal newAnimal();
}
//具体工厂：养马场
class HorseFarm implements AnimalFarm
{
    public Animal newAnimal()
    {
        System.out.println("新马出生！");
        return new Horse();
    }
}
//具体工厂：养牛场
class CattleFarm implements AnimalFarm
{
    public Animal newAnimal()
    {
        System.out.println("新牛出生！");
        return new Cattle();
    }
}
```
```java
package FactoryMethod;
import javax.xml.parsers.*;
import org.w3c.dom.*;
import java.io.*;
class ReadXML2
{
    public static Object getObject()
    {
        try
        {
            DocumentBuilderFactory dFactory=DocumentBuilderFactory.newInstance();
            DocumentBuilder builder=dFactory.newDocumentBuilder();
            Document doc;                           
            doc=builder.parse(new File("src/FactoryMethod/config2.xml"));
            NodeList nl=doc.getElementsByTagName("className");
            Node classNode=nl.item(0).getFirstChild();
            String cName="FactoryMethod."+classNode.getNodeValue();
            System.out.println("新类名："+cName);
            Class<?> c=Class.forName(cName);
              Object obj=c.newInstance();
            return obj;
        }  
        catch(Exception e)
        {
               e.printStackTrace();
               return null;
        }
    }
}
```

### 模式的应用场景
工厂方法模式通常适用于以下场景。
- 客户只知道创建产品的工厂名，而不知道具体的产品名。如 TCL 电视工厂、海信电视工厂等。
- 创建对象的任务由多个具体子工厂中的某一个完成，而抽象工厂只提供创建产品的接口。
- 客户不关心创建产品的细节，只关心产品的品牌。

## 4.抽象工厂模式
前面介绍的工厂方法模式中考虑的是一类产品的生产，如畜牧场只养动物、电视机厂只生产电视机、计算机软件学院只培养计算机软件专业的学生等。
<br/>
同种类称为同等级，也就是说：工厂方法模式只考虑生产同等级的产品，但是在现实生活中许多工厂是综合型的工厂，能生产多等级（种类） 的产品，如农场里既养动物又种植物，电器厂既生产电视机又生产洗衣机或空调，大学既有软件专业又有生物专业等。
<br/>
本节要介绍的抽象工厂模式将考虑多等级产品的生产，将同一个具体工厂所生产的位于不同等级的一组产品称为一个产品族，图 1 所示的是海尔工厂和 TCL 工厂所生产的电视机与空调对应的关系图。
<br/>
![](/images/design/20.gif)
### 模式的定义与特点
抽象工厂（AbstractFactory）模式的定义：是一种为访问类提供一个创建一组相关或相互依赖对象的接口，且访问类无须指定所要产品的具体类就能得到同族的不同等级的产品的模式结构。
<br/>
抽象工厂模式是工厂方法模式的升级版本，工厂方法模式只生产一个等级的产品，而抽象工厂模式可生产多个等级的产品。
<br/>
使用抽象工厂模式一般要满足以下条件。
- 系统中有多个产品族，每个具体工厂创建同一族但属于不同等级结构的产品。
- 系统一次只可能消费其中某一族产品，即同族的产品一起使用。
<br/>
抽象工厂模式除了具有工厂方法模式的优点外，其他主要优点如下。
- 可以在类的内部对产品族中相关联的多等级产品共同管理，而不必专门引入多个新的类来进行管理。
- 当增加一个新的产品族时不需要修改原代码，满足开闭原则。
<br/>
其缺点是：当产品族中需要增加一个新的产品时，所有的工厂类都需要进行修改。
### 模式的结构与实现
抽象工厂模式同工厂方法模式一样，也是由抽象工厂、具体工厂、抽象产品和具体产品等 4 个要素构成，但抽象工厂中方法个数不同，抽象产品的个数也不同。现在我们来分析其基本结构和实现方法。
<br/>
#### 1. 模式的结构
抽象工厂模式的主要角色如下。
- 1.抽象工厂（Abstract Factory）：提供了创建产品的接口，它包含多个创建产品的方法 newProduct()，可以创建多个不同等级的产品。
- 2.具体工厂（Concrete Factory）：主要是实现抽象工厂中的多个抽象方法，完成具体产品的创建。
- 3.抽象产品（Product）：定义了产品的规范，描述了产品的主要特性和功能，抽象工厂模式有多个抽象产品。
- 4.具体产品（ConcreteProduct）：实现了抽象产品角色所定义的接口，由具体工厂来创建，它 同具体工厂之间是多对一的关系。
<br/>
抽象工厂模式的结构图如图 2 所示。
<br/>
![](/images/design/21.gif)
#### 2. 模式的实现
从图 2 可以看出抽象工厂模式的结构同工厂方法模式的结构相似，不同的是其产品的种类不止一个，所以创建产品的方法也不止一个。下面给出抽象工厂和具体工厂的代码。
<br/>
(1) 抽象工厂：提供了产品的生成方法。
```java
interface AbstractFactory
{
    public Product1 newProduct1();
    public Product2 newProduct2();
}
```
(2) 具体工厂：实现了产品的生成方法。
class ConcreteFactory1 implements AbstractFactory
{
    public Product1 newProduct1()
    {
        System.out.println("具体工厂 1 生成-->具体产品 11...");
        return new ConcreteProduct11();
    }
    public Product2 newProduct2()
    {
        System.out.println("具体工厂 1 生成-->具体产品 21...");
        return new ConcreteProduct21();
    }
}

### 模式的应用实例
#### 【例1】用抽象工厂模式设计农场类。
分析：农场中除了像畜牧场一样可以养动物，还可以培养植物，如养马、养牛、种菜、种水果等，所以本实例比前面介绍的畜牧场类复杂，必须用抽象工厂模式来实现。
<br/>
本例用抽象工厂模式来设计两个农场，一个是韶关农场用于养牛和种菜，一个是上饶农场用于养马和种水果，可以在以上两个农场中定义一个生成动物的方法 newAnimal() 和一个培养植物的方法 newPlant()。
<br/>
对马类、牛类、蔬菜类和水果类等具体产品类，由于要显示它们的图像（[点此下载图片](http://c.biancheng.net/uploads/soft/181113/3-1Q114160J0.zip)），所以它们的构造函数中用到了 JPanel、JLabel 和 ImageIcon 等组件，并定义一个 show() 方法来显示它们。
<br/>
客户端程序通过对象生成器类 ReadXML 读取 XML 配置文件中的数据来决定养什么动物和培养什么植物（[点此下载 XML 文件](http://c.biancheng.net/uploads/soft/181113/3-1Q114160S7.zip)）。其结构图如图 3 所示。
<br/>
![](/images/design/22.gif)
<br/>
```java
package AbstractFactory;
import java.awt.*;
import javax.swing.*;
public class FarmTest
{
    public static void main(String[] args)
    {
        try
        {          
            Farm f;
            Animal a;
            Plant p;
            f=(Farm) ReadXML.getObject();
            a=f.newAnimal();
            p=f.newPlant();
            a.show();
            p.show();
        }
        catch(Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}
//抽象产品：动物类
interface Animal
{
    public void show();
}
//具体产品：马类
class Horse implements Animal
{
    JScrollPane sp;
    JFrame jf=new JFrame("抽象工厂模式测试");
    public Horse()
    {
        Container contentPane=jf.getContentPane();
        JPanel p1=new JPanel();
        p1.setLayout(new GridLayout(1,1));
        p1.setBorder(BorderFactory.createTitledBorder("动物：马"));
        sp=new JScrollPane(p1);
        contentPane.add(sp, BorderLayout.CENTER);
        JLabel l1=new JLabel(new ImageIcon("src/A_Horse.jpg"));
        p1.add(l1);       
        jf.pack();       
        jf.setVisible(false);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);//用户点击窗口关闭 
    }
    public void show()
    {
        jf.setVisible(true);
    }
}
//具体产品：牛类
class Cattle implements Animal
{
    JScrollPane sp;
    JFrame jf=new JFrame("抽象工厂模式测试");
    public Cattle() {
        Container contentPane=jf.getContentPane();
        JPanel p1=new JPanel();
        p1.setLayout(new GridLayout(1,1));
        p1.setBorder(BorderFactory.createTitledBorder("动物：牛"));
        sp=new JScrollPane(p1);
        contentPane.add(sp, BorderLayout.CENTER);
        JLabel l1=new JLabel(new ImageIcon("src/A_Cattle.jpg"));
        p1.add(l1);       
        jf.pack();       
        jf.setVisible(false);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);//用户点击窗口关闭 
    }
    public void show()
    {
        jf.setVisible(true);
    }
}
//抽象产品：植物类
interface Plant
{
    public void show();
}
//具体产品：水果类
class Fruitage implements Plant
{
    JScrollPane sp;
    JFrame jf=new JFrame("抽象工厂模式测试");
    public Fruitage()
    {
        Container contentPane=jf.getContentPane();
        JPanel p1=new JPanel();
        p1.setLayout(new GridLayout(1,1));
        p1.setBorder(BorderFactory.createTitledBorder("植物：水果"));
        sp=new JScrollPane(p1);
        contentPane.add(sp, BorderLayout.CENTER);
        JLabel l1=new JLabel(new ImageIcon("src/P_Fruitage.jpg"));
        p1.add(l1);       
        jf.pack();       
        jf.setVisible(false);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);//用户点击窗口关闭 
    }
    public void show()
    {
        jf.setVisible(true);
    }
}
//具体产品：蔬菜类
class Vegetables implements Plant
{
    JScrollPane sp;
    JFrame jf=new JFrame("抽象工厂模式测试");
    public Vegetables()
    {
        Container contentPane=jf.getContentPane();
        JPanel p1=new JPanel();
        p1.setLayout(new GridLayout(1,1));
        p1.setBorder(BorderFactory.createTitledBorder("植物：蔬菜"));
        sp=new JScrollPane(p1);
        contentPane.add(sp, BorderLayout.CENTER);
        JLabel l1=new JLabel(new ImageIcon("src/P_Vegetables.jpg"));
        p1.add(l1);       
        jf.pack();       
        jf.setVisible(false);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);//用户点击窗口关闭 
    }
    public void show()
    {
        jf.setVisible(true);
    }
}
//抽象工厂：农场类
interface Farm
{
    public Animal newAnimal();
    public Plant newPlant();
}
//具体工厂：韶关农场类
class SGfarm implements Farm
{
    public Animal newAnimal()
    {
        System.out.println("新牛出生！");
        return new Cattle();
    }
    public Plant newPlant()
    {
        System.out.println("蔬菜长成！");
        return new Vegetables();
    }
}
//具体工厂：上饶农场类
class SRfarm implements Farm
{
    public Animal newAnimal()
    {
        System.out.println("新马出生！");
        return new Horse();
    }
    public Plant newPlant()
    {
        System.out.println("水果长成！");
        return new Fruitage();
    }
}
```


```java
package AbstractFactory;
import javax.xml.parsers.*;
import org.w3c.dom.*;
import java.io.*;
class ReadXML
{
    public static Object getObject()
    {
        try
        {
            DocumentBuilderFactory dFactory=DocumentBuilderFactory.newInstance();
            DocumentBuilder builder=dFactory.newDocumentBuilder();
            Document doc;                           
            doc=builder.parse(new File("src/AbstractFactory/config.xml"));
            NodeList nl=doc.getElementsByTagName("className");
            Node classNode=nl.item(0).getFirstChild();
            String cName="AbstractFactory."+classNode.getNodeValue();
            System.out.println("新类名："+cName);
            Class<?> c=Class.forName(cName);
              Object obj=c.newInstance();
            return obj;
        }  
        catch(Exception e)
        {
               e.printStackTrace();
               return null;
        }
    }
}
```

### 模式的应用场景
抽象工厂模式最早的应用是用于创建属于不同操作系统的视窗构件。如 java 的 AWT 中的 Button 和 Text 等构件在 Windows 和 UNIX 中的本地实现是不同的。
<br/>
抽象工厂模式通常适用于以下场景：
- 当需要创建的对象是一系列相互关联或相互依赖的产品族时，如电器工厂中的电视机、洗衣机、空调等。
- 系统中有多个产品族，但每次只使用其中的某一族产品。如有人只喜欢穿某一个品牌的衣服和鞋。
- 系统中提供了产品的类库，且所有产品的接口相同，客户端不依赖产品实例的创建细节和内部结构。

### 模式的扩展
抽象工厂模式的扩展有一定的“开闭原则”倾斜性：
- 当增加一个新的产品族时只需增加一个新的具体工厂，不需要修改原代码，满足开闭原则。
- 当产品族中需要增加一个新种类的产品时，则所有的工厂类都需要进行修改，不满足开闭原则。
<br/>
另一方面，当系统中只存在一个等级结构的产品时，抽象工厂模式将退化到工厂方法模式。




## 5.建造者模式（Bulider模式）详解
在软件开发过程中有时需要创建一个复杂的对象，这个复杂对象通常由多个子部件按一定的步骤组合而成。例如，计算机是由 CPU、主板、内存、硬盘、显卡、机箱、显示器、键盘、鼠标等部件组装而成的，采购员不可能自己去组装计算机，而是将计算机的配置要求告诉计算机销售公司，计算机销售公司安排技术人员去组装计算机，然后再交给要买计算机的采购员。
<br/>
生活中这样的例子很多，如游戏中的不同角色，其性别、个性、能力、脸型、体型、服装、发型等特性都有所差异；还有汽车中的方向盘、发动机、车架、轮胎等部件也多种多样；每封电子邮件的发件人、收件人、主题、内容、附件等内容也各不相同。
<br/>
以上所有这些产品都是由多个部件构成的，各个部件可以灵活选择，但其创建步骤都大同小异。这类产品的创建无法用前面介绍的工厂模式描述，只有建造者模式可以很好地描述该类产品的创建。
### 模式的定义与特点
建造者（Builder）模式的定义：指将一个复杂对象的构造与它的表示分离，使同样的构建过程可以创建不同的表示，这样的设计模式被称为建造者模式。它是将一个复杂的对象分解为多个简单的对象，然后一步一步构建而成。它将变与不变相分离，即产品的组成部分是不变的，但每一部分是可以灵活选择的。
<br/>
该模式的主要优点如下：
- 1.各个具体的建造者相互独立，有利于系统的扩展。
- 2.客户端不必知道产品内部组成的细节，便于控制细节风险。
<br/>
其缺点如下：
- 1.产品的组成部分必须相同，这限制了其使用范围。
- 2.如果产品的内部变化复杂，该模式会增加很多的建造者类。
<br/>
建造者（Builder）模式和工厂模式的关注点不同：建造者模式注重零部件的组装过程，而工厂方法模式更注重零部件的创建过程，但两者可以结合使用。

### 模式的结构与实现
建造者（Builder）模式由产品、抽象建造者、具体建造者、指挥者等 4 个要素构成，现在我们来分析其基本结构和实现方法。

#### 1. 模式的结构
建造者（Builder）模式的主要角色如下。
- 1.产品角色（Product）：它是包含多个组成部件的复杂对象，由具体建造者来创建其各个滅部件。
- 2.抽象建造者（Builder）：它是一个包含创建产品各个子部件的抽象方法的接口，通常还包含一个返回复杂产品的方法 getResult()。
- 3.具体建造者(Concrete Builder）：实现 Builder 接口，完成复杂产品的各个部件的具体创建方法。
- 4.指挥者（Director）：它调用建造者对象中的部件构造与装配方法完成复杂对象的创建，在指挥者中不涉及具体产品的信息。
<br/>
![](/images/design/23.gif)
<br/>

#### 2. 模式的实现
(1) 产品角色：包含多个组成部件的复杂对象。
```java
class Product
{
    private String partA;
    private String partB;
    private String partC;
    public void setPartA(String partA)
    {
        this.partA=partA;
    }
    public void setPartB(String partB)
    {
        this.partB=partB;
    }
    public void setPartC(String partC)
    {
        this.partC=partC;
    }
    public void show()
    {
        //显示产品的特性
    }
}
```
(2) 抽象建造者：包含创建产品各个子部件的抽象方法。
```java
abstract class Builder
{
    //创建产品对象
    protected Product product=new Product();
    public abstract void buildPartA();
    public abstract void buildPartB();
    public abstract void buildPartC();
    //返回产品对象
    public Product getResult()
    {
        return product;
    }
}
```
(3) 具体建造者：实现了抽象建造者接口。
```java
public class ConcreteBuilder extends Builder
{
    public void buildPartA()
    {
        product.setPartA("建造 PartA");
    }
    public void buildPartB()
    {
        product.setPartA("建造 PartB");
    }
    public void buildPartC()
    {
        product.setPartA("建造 PartC");
    }
}
```
(4) 指挥者：调用建造者中的方法完成复杂对象的创建。
```java
class Director
{
    private Builder builder;
    public Director(Builder builder)
    {
        this.builder=builder;
    }
    //产品构建与组装方法
    public Product construct()
    {
        builder.buildPartA();
        builder.buildPartB();
        builder.buildPartC();
        return builder.getResult();
    }
}
```
(5) 客户类
```java
public class Client
{
    public static void main(String[] args)
    {
        Builder builder=new ConcreteBuilder();
        Director director=new Director(builder);
        Product product=director.construct();
        product.show();
    }
}
```

### 模式的应用实例
#### 【例1】用建造者（Builder）模式描述客厅装修。
分析：客厅装修是一个复杂的过程，它包含墙体的装修、电视机的选择、沙发的购买与布局等。客户把装修要求告诉项目经理，项目经理指挥装修工人一步步装修，最后完成整个客厅的装修与布局，所以本实例用建造者模式实现比较适合。
<br/>
这里客厅是产品，包括墙、电视和沙发等组成部分。具体装修工人是具体建造者，他们负责装修与墙、电视和沙发的布局。项目经理是指挥者，他负责指挥装修工人进行装修。
<br/>
另外，客厅类中提供了 show() 方法，可以将装修效果图显示出来（[点此下载装修效果图的图片](/images/design/25.png)）。客户端程序通过对象生成器类 ReadXML 读取 XML 配置文件中的装修方案数据（点此下载 XML 文件），调用项目经理进行装修。其类图如图 2 所示。
<br/>
![](/images/design/24.gif)
```java
package Builder;
import java.awt.*;
import javax.swing.*;
public class ParlourDecorator
{
    public static void main(String[] args)
    {
        try
        {
            Decorator d;
            d=(Decorator) ReadXML.getObject();
            ProjectManager m=new ProjectManager(d);       
            Parlour p=m.decorate();
            p.show();
        }
        catch(Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}
//产品：客厅
class Parlour
{
    private String wall;    //墙
    private String TV;    //电视
    private String sofa;    //沙发  
    public void setWall(String wall)
    {
        this.wall=wall;
    }
    public void setTV(String TV)
    {
        this.TV=TV;
    }
    public void setSofa(String sofa)
    {
        this.sofa=sofa;
    }   
    public void show()
    {
        JFrame jf=new JFrame("建造者模式测试");
        Container contentPane=jf.getContentPane();
        JPanel p=new JPanel();   
        JScrollPane sp=new JScrollPane(p);  
        String parlour=wall+TV+sofa;
        JLabel l=new JLabel(new ImageIcon("src/"+parlour+".png"));
        p.setLayout(new GridLayout(1,1));
        p.setBorder(BorderFactory.createTitledBorder("客厅"));
        p.add(l);
        contentPane.add(sp,BorderLayout.CENTER);       
        jf.pack();  
        jf.setVisible(true);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }   
}
//抽象建造者：装修工人
abstract class Decorator
{
    //创建产品对象
    protected  Parlour product=new Parlour();
    public  abstract void buildWall();
    public  abstract void buildTV();
    public  abstract void buildSofa();
    //返回产品对象
    public  Parlour getResult()
    {
        return  product;
    }
}
//具体建造者：具体装修工人1
class ConcreteDecorator1  extends Decorator
{
    public void buildWall()
    {
        product.setWall("w1");
    }
    public void buildTV()
    {
        product.setTV("TV1");
    }
    public void buildSofa()
    {
        product.setSofa("sf1");
    }
}
//具体建造者：具体装修工人2
class ConcreteDecorator2 extends Decorator
{
    public void buildWall()
    {
        product.setWall("w2");
      }
      public void buildTV()
      {
          product.setTV("TV2");
      }
      public void buildSofa()
      {
          product.setSofa("sf2");
      }
}
//指挥者：项目经理
class ProjectManager
{
    private Decorator builder;
    public ProjectManager(Decorator builder)
    {
          this.builder=builder;
    }
    //产品构建与组装方法
    public Parlour decorate()
    {
          builder.buildWall();
        builder.buildTV();
        builder.buildSofa();
        return builder.getResult();
    }
}
```
```java
package Builder;
import javax.xml.parsers.*;
import org.w3c.dom.*;
import java.io.*;
class ReadXML
{
    public static Object getObject()
    {
        try
        {
            DocumentBuilderFactory dFactory=DocumentBuilderFactory.newInstance();
            DocumentBuilder builder=dFactory.newDocumentBuilder();
            Document doc;                           
            doc=builder.parse(new File("src/Builder/config.xml"));
            NodeList nl=doc.getElementsByTagName("className");
            Node classNode=nl.item(0).getFirstChild();
            String cName="Builder."+classNode.getNodeValue();
            System.out.println("新类名："+cName);
            Class<?> c=Class.forName(cName);
              Object obj=c.newInstance();
            return obj;
         }  
         catch(Exception e)
         {
                   e.printStackTrace();
                   return null;
         }
    }
}
```
### 模式的应用场景
建造者（Builder）模式创建的是复杂对象，其产品的各个部分经常面临着剧烈的变化，但将它们组合在一起的算法却相对稳定，所以它通常在以下场合使用。
- 创建的对象较复杂，由多个部件构成，各部件面临着复杂的变化，但构件间的建造顺序是稳定的。
- 创建复杂对象的算法独立于该对象的组成部分以及它们的装配方式，即产品的构建过程和最终的表示是独立的。

### 模式的扩展
建造者（Builder）模式在应用过程中可以根据需要改变，如果创建的产品种类只有一种，只需要一个具体建造者，这时可以省略掉抽象建造者，甚至可以省略掉指挥者角色。

## 6.结构型模式概述（结构型模式的分类）












