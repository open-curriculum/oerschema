import { json } from "@remix-run/node";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ExampleCard } from "~/components/example-card";

export const loader = async () => {
  return json({});
};

export default function ExamplesPage() {
  const basicResourceImplementation = `<div itemscope itemtype="http://oerschema.org/Resource">
  <h2 itemprop="name">Introduction to Algebra</h2>
  <meta itemprop="additionalType" content="textbook" />
  <p itemprop="description">
    A foundational textbook covering basic algebraic concepts.
  </p>
  <a itemprop="uri" href="https://example.com/intro-to-algebra">
    View Resource
  </a>
  <div itemprop="author" itemscope itemtype="http://oerschema.org/Person">
    <span itemprop="name">Jane Doe</span>
  </div>
</div>`;

  const courseExampleImplementation = `<div itemscope itemtype="http://oerschema.org/Course">
  <h2 itemprop="name">Data Science Fundamentals</h2>
  <p itemprop="description">
    Learn the basics of data science including data analysis, 
    visualization, and machine learning.
  </p>
  
  <div>
    <h3>Course Sections:</h3>
    <div itemprop="hasPart" itemscope 
      itemtype="http://oerschema.org/CourseSection">
      <span itemprop="name">Introduction to Data Analysis</span>
    </div>
    
    <div itemprop="hasPart" itemscope 
      itemtype="http://oerschema.org/CourseSection">
      <span itemprop="name">Data Visualization Techniques</span>
    </div>
    
    <div itemprop="hasPart" itemscope 
      itemtype="http://oerschema.org/CourseSection">
      <span itemprop="name">Machine Learning Basics</span>
    </div>
  </div>
  
  <div>
    <h3>Course Materials:</h3>
    <div itemprop="associatedMaterial" itemscope 
      itemtype="http://oerschema.org/SupplementalMaterial">
      <p itemprop="name">Python for Data Science Handbook</p>
    </div>
  </div>
</div>`;

  const learningObjectiveImplementation = `<div itemscope itemtype="http://oerschema.org/LearningObjective">
  <h3>Learning Objective:</h3>
  <p itemprop="description">
    Students will be able to analyze and interpret statistical 
    data using Python.
  </p>
  
  <div>
    <span>Associated Topics:</span>
    <div itemprop="objectiveTopic" itemscope 
      itemtype="http://oerschema.org/Topic">
      <span itemprop="name">Data Analysis</span>
    </div>
    <div itemprop="objectiveTopic" itemscope 
      itemtype="http://oerschema.org/Topic">
      <span itemprop="name">Statistics</span>
    </div>
    <div itemprop="objectiveTopic" itemscope 
      itemtype="http://oerschema.org/Topic">
      <span itemprop="name">Python</span>
    </div>
  </div>
  
  <div>
    <span>Assessment Method:</span>
    <div itemprop="assessment" itemscope 
      itemtype="http://oerschema.org/Assessment">
      <span itemprop="name">Portfolio Project</span>
    </div>
  </div>
  
  <div>
    <span>Required Actions:</span>
    <link itemprop="action" href="http://oerschema.org/Researching" />
    <link itemprop="action" href="http://oerschema.org/Making" />
  </div>
</div>`;

  const assessmentImplementation = `<div itemscope itemtype="http://oerschema.org/Assessment">
  <h2 itemprop="name">Final Project: Data Analysis Report</h2>
  <meta itemprop="type" content="project" />
  <p itemprop="description">
    Create a comprehensive data analysis report on a dataset 
    of your choice.
  </p>
  
  <div itemprop="gradeFormat" itemscope 
    itemtype="http://oerschema.org/PointGradeFormat">
    <h3>Grading Information</h3>
    <p>Graded on a <span itemprop="points">100</span>-point scale</p>
    <p>Required passing score: 
      <span itemprop="passingScore">70</span>
    </p>
  </div>
  
  <div>
    <h3>Instructions:</h3>
    <ol>
      <li itemprop="instructions">Choose a dataset from the provided sources</li>
      <li itemprop="instructions">Clean and preprocess the data</li>
      <li itemprop="instructions">Perform exploratory data analysis</li>
      <li itemprop="instructions">Create visualizations of key findings</li>
      <li itemprop="instructions">Write a 1000-word report summarizing insights</li>
    </ol>
  </div>
  
  <link itemprop="targetLearningResource" 
    href="#data-analysis-course-unit" />
  <link itemprop="learningActionType" 
    href="http://oerschema.org/Making" />
  <link itemprop="learningActionType" 
    href="http://oerschema.org/Researching" />
</div>`;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">OER Schema Examples</h1>
      <p className="text-lg mb-8">
        Below are examples of how to implement OER Schema in different contexts. Each example includes both the markup and a visual representation.
      </p>

      <Tabs defaultValue="example1" className="space-y-4">
        <div className="overflow-visible pb-2 mb-4">
          <TabsList className="w-full">
            <TabsTrigger value="example1" className="flex-1 ">Basic Resource</TabsTrigger>
            <TabsTrigger value="example2" className="flex-1 ">Course Example</TabsTrigger>
            <TabsTrigger value="example3" className="flex-1 ">Learning Objective</TabsTrigger>
            <TabsTrigger value="example4" className="flex-1 ">Assessment</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="example1">
          <ExampleCard
            title="Example 1: Basic Resource (Textbook)"
            description="A simple example of a Resource, such as a textbook. Uses properties inherited from schema.org where not directly specified in local schema."
            implementation={basicResourceImplementation}
            visual={
              <div>
                <h2 className="text-xl font-bold">Introduction to Algebra</h2>
                <p className="text-sm text-muted-foreground mb-2">Type: textbook</p>
                <p className="mb-2">
                  A foundational textbook covering basic algebraic concepts.
                </p>
                <a href="#" className="text-blue-600 hover:underline">View Resource</a>
                <div className="mt-2">
                  <span className="text-sm font-medium">Author:</span> Jane Doe
                </div>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="example2">
          <ExampleCard
            title="Example 2: Course Structure"
            description="An example of a Course with multiple CourseSections and associated materials."
            implementation={courseExampleImplementation}
            visual={
              <div>
                <h2 className="text-xl font-bold">Data Science Fundamentals</h2>
                <p className="mb-2">
                  Learn the basics of data science including data analysis, visualization, and machine learning.
                </p>
                <div className="mt-4">
                  <h3 className="font-semibold">Course Sections:</h3>
                  <ul className="list-disc ml-5 mt-2 space-y-2">
                    <li>Introduction to Data Analysis</li>
                    <li>Data Visualization Techniques</li>
                    <li>Machine Learning Basics</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold">Course Materials:</h3>
                  <div className="bg-background rounded p-2 mt-2">
                    <p className="font-medium">Python for Data Science Handbook</p>
                    <p className="text-sm text-muted-foreground">Supplemental Material</p>
                  </div>
                </div>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="example3">
          <ExampleCard
            title="Example 3: Learning Objective"
            description="An example of defining learning objectives that can be associated with educational resources."
            implementation={learningObjectiveImplementation}
            visual={
              <div>
                <div className="mb-4 pb-4 border-b">
                  <h3 className="text-lg font-bold">Learning Objective:</h3>
                  <p>Students will be able to analyze and interpret statistical data using Python.</p>
                </div>
                <div>
                  <p><span className="font-medium">Associated Topics:</span> Data Analysis, Statistics, Python</p>
                  <p className="mt-2"><span className="font-medium">Assessment Method:</span> Portfolio Project</p>
                  <p className="mt-2"><span className="font-medium">Required Actions:</span> Analyzing, Coding</p>
                </div>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="example4">
          <ExampleCard
            title="Example 4: Assessment Component"
            description="An example of an Assessment that demonstrates using more complex nested schema structures."
            implementation={assessmentImplementation}
            visual={
              <div>
                <h2 className="text-xl font-bold">Final Project: Data Analysis Report</h2>
                <div className="text-sm text-muted-foreground mb-3">Type: Assessment</div>
                <p className="mb-4">Create a comprehensive data analysis report on a dataset of your choice.</p>
                
                <div className="bg-background p-3 rounded-lg mb-4">
                  <h3 className="font-medium">Grading Information</h3>
                  <p>Graded on a 100-point scale</p>
                  <p>Required passing score: 70</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Instructions:</h3>
                  <ol className="list-decimal ml-5 space-y-1">
                    <li>Choose a dataset from the provided sources</li>
                    <li>Clean and preprocess the data</li>
                    <li>Perform exploratory data analysis</li>
                    <li>Create visualizations of key findings</li>
                    <li>Write a 1000-word report summarizing insights</li>
                  </ol>
                </div>
              </div>
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}